const { SmsSession, User, PG } = require("../models");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require('bcrypt');
const geocoder = require("../utils/geocoder");
const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dkieieuoi/image/upload/v1754643154/pg_images/jag8zcpg1t1cm63r59uj.png";
exports.incomingSms = asyncHandler(async (req, res) => {
    const from = req.body.From;
    const body = req.body.Body ? req.body.Body.trim() : '';

    // console.log(`📨 Incoming SMS from ${from}: ${body}`);

    if (!from) {
        return res.status(400).send("Missing From number");
    }

    
    let session = await SmsSession.findOne({ where: { phoneNumber: from } });
    if (!session) {
        session = await SmsSession.create({ phoneNumber: from });
    }

    let message = "";
    let nextStep = session.step;
    let draft = session.draftData ? JSON.parse(JSON.stringify(session.draftData)) : {};

   
    if (body.toUpperCase() === 'RESET') {
        await session.update({ step: 'INIT', draftData: {} });
        res.set('Content-Type', 'text/xml');
        return res.send(`<Response><Message>Session reset. Send 'Hi' to start listing your PG.</Message></Response>`);
    }

   
    switch (session.step) {
        case 'INIT':
            message = "Welcome to PGLink! Let's list your PG. \n\nFirst, please enter your Full Name.";
            nextStep = 'ASK_USER_NAME';
            break;

        case 'ASK_USER_NAME':
            draft.ownerName = body;
            message = `Nice to meet you ${body}! \n\nWhat is the NAME of your PG?`;
            nextStep = 'ASK_PG_NAME';
            break;

        case 'ASK_PG_NAME':
            draft.title = body;
            message = `Got it: "${body}". \n\nWhich CITY is it located in?`;
            nextStep = 'ASK_CITY';
            break;

        case 'ASK_CITY':
            draft.city = body;
            message = "Which DISTRICT is it in?";
            nextStep = 'ASK_DISTRICT';
            break;

        case 'ASK_DISTRICT':
            draft.district = body;
            message = "Which STATE is it in?";
            nextStep = 'ASK_STATE';
            break;

        case 'ASK_STATE':
            draft.state = body;
            message = "What is the PINCODE?";
            nextStep = 'ASK_PINCODE';
            break;

        case 'ASK_PINCODE':
            draft.pincode = body;
            message = "Okay. Please send the full ADDRESS (Area, Sector, etc).";
            nextStep = 'ASK_ADDRESS';
            break;

        case 'ASK_ADDRESS':
            draft.address = body;
            
            message = "Address saved. \n\nWhat is the monthly RENT? (Numbers only, e.g. 5000)";
            nextStep = 'ASK_RENT';
            break;

        case 'ASK_RENT':
            if (isNaN(body)) {
                message = "Invalid number. Please enter the Rent again (digits only).";
                
            } else {
                draft.rent = parseFloat(body);
                message = "Amenities? \nReply with codes separated by comma: \n1=Wifi, 2=AC, 3=Food, 4=Laundry \n(e.g. 1,3)";
                nextStep = 'ASK_AMENITIES';
            }
            break;

        case 'ASK_AMENITIES':
            const codes = body.split(',').map(s => s.trim());
            const amenities = {
                wifi: codes.includes('1'),
                ac: codes.includes('2'),
                food: codes.includes('3'),
                laundry: codes.includes('4')
            };
            draft.amenities = amenities;

            
            let location = null;
            try {
                const fullQuery = `${draft.address}, ${draft.city}, ${draft.district}, ${draft.state}, ${draft.pincode}`;
                const loc = await geocoder.geocode(fullQuery);
                if (loc && loc.length > 0) {
                    location = { type: 'Point', coordinates: [loc[0].longitude, loc[0].latitude] };
                }
            } catch (err) {
                console.error("SMS Geocoding failed:", err.message);
            }

          
            const emailPlaceholder = `${from.replace(/\D/g,'')}@sms.pglink.in`; 
            
            let user = await User.findOne({ where: { email: emailPlaceholder } });
            if (!user) {
                const hashedPassword = await bcrypt.hash("sms_generated_pass", 10);
                user = await User.create({
                    name: draft.ownerName || "PG Owner (SMS)",
                    email: emailPlaceholder,
                    password: hashedPassword,
                    role: "owner"
                });
            }

           
            const newPG = await PG.create({
                title: draft.title,
                city: draft.city,
                district: draft.district,
                state: draft.state,
                pincode: draft.pincode,
                address: draft.address,
                rent: draft.rent,
                amenities: draft.amenities,
                contactNumber: from,
                ownerId: user.id,
                imageUrl: DEFAULT_IMAGE_URL , 
                location: location
            });

            message = `Success! Your PG "${draft.title}" is listed (ID: ${newPG.id}).`;
            
            
            nextStep = 'INIT';
            draft = {};
            break;

        default:
            
            message = "Welcome to PGLink! Send 'List' to start.";
            nextStep = 'INIT';
    }

    
    await session.update({ step: nextStep, draftData: draft });

    
    res.set('Content-Type', 'text/xml');
    res.send(`
        <Response>
            <Message>${message}</Message>
        </Response>
    `);
});
