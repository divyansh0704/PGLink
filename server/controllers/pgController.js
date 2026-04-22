const { PG, User, UserUnlockedPGs, College } = require("../models");
const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const geocoder = require("../utils/geocoder");
const sequelize = require("../config/database");
const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dkieieuoi/image/upload/v1754643154/pg_images/jag8zcpg1t1cm63r59uj.png";


exports.createPG = asyncHandler(async (req, res) => {
    // console.log(req.file);
    let imageUrl;
    if (req.file) {
        imageUrl = req.file.path;
    } else {
        imageUrl = DEFAULT_IMAGE_URL;
    }
    let amenities = req.body.amenities;
    if (typeof amenities === 'string') {
        amenities = JSON.parse(amenities);
    }
    let location = null;
    const { latitude, longitude } = req.body;
    if (latitude && longitude) {
        location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
        // console.log(" Location :", location);
    } else {
        try {
            const { address, city, district, state, pincode } = req.body;
            const fullAddress = [address, city, district, state, pincode]
                .filter(Boolean)
                .join(', ');
            let loc = await geocoder.geocode(fullAddress);
            //  If detailed address fails
            if (!loc || loc.length === 0) {
                const fallbackAddress = [city, district, state, pincode].filter(Boolean).join(', ');
                console.log(`⚠️ Detailed geocoding failed. Retrying with fallback: "${fallbackAddress}"`);
                loc = await geocoder.geocode(fallbackAddress);
            }

            if (loc && loc.length > 0) {
                const { latitude: lat, longitude: lon } = loc[0];
                location = { type: 'Point', coordinates: [lon, lat] };
                console.log("📍 Geocoded location:", location);
            } else {
                console.warn("⚠️ Geocoding failed completely for address:", fullAddress);
            }


        } catch (error) {
            console.error("Error during geocoding:", error.message);
        }
    }
    const pg = await PG.create({
        ...req.body,
        amenities,
        ownerId: req.user.id,
        imageUrl,
        location
    });
    res.status(201).json({ message: "PG created successfully", pg });

})
// {include:User}
exports.getAllPGs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const offset = (page - 1) * limit;
    const search = req.query.q;
    const collegeId = req.query.collegeId;
    const sortBy = req.query.sortBy || "createdAt";
    const where = {};

    let order;

    let targetCollege = null;


    if (collegeId) {
        targetCollege = await College.findByPk(collegeId);
    }

    else if (search) {
        const colleges = await College.findAll({
            where: { name: { [Op.iLike]: `%${search}%` } }
        });

        if (colleges.length > 1) {
            return res.json({
                disambiguation: true,
                colleges: colleges.map(c => ({ id: c.id, name: c.name, city: c.city, state: c.state }))
            });
        } else if (colleges.length === 1) {
            targetCollege = colleges[0];
        }
    }

    if (targetCollege) {
        const collegeLocation = targetCollege.location;


        const collegeWkt = `POINT(${collegeLocation.coordinates[1]} ${collegeLocation.coordinates[0]})`;

        const { count, rows } = await PG.findAndCountAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`ST_DistanceSphere(location, ST_GeomFromText('${collegeWkt}', 4326)) / 1000`),
                        'distanceKm'
                    ]
                ]
            },
            where: {
                location: { [Op.ne]: null }
            },
            limit,
            offset,
            order: sequelize.col('distanceKm'),
            include: {
                model: User,
                attributes: ['id', 'name', 'email']
            }
        })
        const pgsWithCollege = rows.map(pg => {
            const pgJson = pg.toJSON();
            pgJson.collegeName = targetCollege.name;
            return pgJson;
        });

        return res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            pgs: pgsWithCollege
        });
    } else if (search) {
        where[Op.or] = [
            { title: { [Op.iLike]: `%${search}%` } },
            { address: { [Op.iLike]: `%${search}%` } },
            { city: { [Op.iLike]: `%${search}%` } },
        ];
    }



    switch (sortBy) {
        case 'rentAsc':
            order = [['rent', 'ASC']];
            break;
        case 'rentDesc':
            order = [['rent', 'DESC']];
            break;
        case 'city':
            order = [['city', 'ASC']];
            break;
        default:
            order = [['createdAt', 'DESC']];
            break;
    }
    const { count, rows } = await PG.findAndCountAll({
        where,
        limit,
        offset,
        order,
        include: {
            model: User,
            attributes: ['id', 'name', 'email']
        }
    })
    res.json({
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pgs: rows
    })



})

exports.getPGById = asyncHandler(async (req, res) => {
    // console.log("Request URL:", req.url);
    const pgId = req.params.id;
    // console.log("pgid : ", pgId);
    const pg = await PG.findByPk(pgId);

    res.json(pg);
});

exports.getPGByOwner = asyncHandler(async (req, res) => {


    // console.log("Fetching PGs for ownerId:", req.user.id);
    const pgs = await PG.findAll({
        where: { ownerId: req.user.id }
    })
    // console.log("pg:",pgs);
    // console.log("Found PGs:", pgs);

    res.json(pgs);



})
exports.deletePG = asyncHandler(async (req, res) => {

    const pgId = req.params.id;
    // console.log(pgId);
    const pg = await PG.findByPk(pgId);

    if (!pg) {
        return res.status(404).json({ message: 'PG not found' });
    }
    if (pg.ownerId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    await pg.destroy();
    res.json({ message: 'PG deleted successfully' });




})

exports.updatePG = asyncHandler(async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);

    try {
        const pgId = req.params.id;
        const existingPG = await PG.findByPk(pgId);

        if (!existingPG) {
            return res.status(404).json({ message: 'updation failed' });
        }


        if (existingPG.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }


        existingPG.title = req.body.title || existingPG.title;
        existingPG.city = req.body.city || existingPG.city;
        existingPG.address = req.body.address || existingPG.address;
        existingPG.rent = req.body.rent || existingPG.rent;
        existingPG.amenities = req.body.amenities || existingPG.amenities;


        if (req.file) {
            existingPG.imageUrl = req.file.path || existingPG.imageUrl;
        }

        await existingPG.save();

        res.json(existingPG);

    } catch (err) {
        return res.status(404).json({ message: 'PG not found' });
    }



});

exports.unlockedPG = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const currentDate = new Date();

    const unlocked = await UserUnlockedPGs.findAll({
        where: {
            userId,
            expiresAt: {
                [require('sequelize').Op.gt]: currentDate // Only get unlocks that haven't expired
            }
        },
        include: [PG]
    });

    const pgList = unlocked.map(entry => entry.PG);
    res.json(pgList);

});
exports.limited = asyncHandler(async (req, res) => {
    const pgs = await PG.findAll({
        limit: 12,
        order: [['createdAt', 'DESC']],
    });
    res.json(pgs);

});
exports.allPGs = asyncHandler(async (req, res) => {

    const allPgs = await PG.findAll({
        order: [['createdAt', 'DESC']],
    });
    res.json(allPgs);

});



UserUnlockedPGs.belongsTo(PG, { foreignKey: 'pgId' });
PG.hasMany(UserUnlockedPGs, { foreignKey: 'pgId' });
