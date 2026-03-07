const { PG, User, UserUnlockedPGs } = require("../models");
const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");


const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dkieieuoi/image/upload/v1754643154/pg_images/jag8zcpg1t1cm63r59uj.png";


exports.createPG = asyncHandler( async (req, res) => {

        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        } else {
            imageUrl = DEFAULT_IMAGE_URL;
        }
        // console.log("Uploaded to Cloudinary:", req.file?.path);


        let amenities = req.body.amenities;
        if (typeof amenities === 'string') {
            amenities = JSON.parse(amenities);
        }
        const pg = await PG.create({
            ...req.body,
            amenities,
            ownerId: req.user.id,
            imageUrl
        });
        res.status(201).json({ message: "PG created successfully", pg });

})
// {include:User}
exports.getAllPGs =asyncHandler( async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const offset = (page - 1) * limit;
    const search = req.query.q;
    const sortBy = req.query.sortBy || "college";
    const where = {};
    if (search) {
        where[Op.or] = [
            { title: { [Op.iLike]: `%${search}%` } },
            { address: { [Op.iLike]: `%${search}%` } },
            { city: { [Op.iLike]: `%${search}%` } },
            { collegeName: { [Op.iLike]: `%${search}%` } },
        ]

    }
    let order;
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
            order = [['collegeName', 'ASC']];
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
    // const pgs = await PG.findAll({
    //     include: {
    //         model: User,
    //         attributes: ['id', 'name', 'email']
    //     }
    // });
    // res.json(pgs)
});

exports.getPGById =asyncHandler( async (req, res) => {
    // console.log("Request URL:", req.url);
    const pgId = req.params.id;
    console.log("pgid : ", pgId);
    const pg = await PG.findByPk(pgId);

    res.json(pg);
});

exports.getPGByOwner =asyncHandler( async (req, res) => {

    
        // console.log("Fetching PGs for ownerId:", req.user.id);
        const pgs = await PG.findAll({
            where: { ownerId: req.user.id }
        })
        // console.log("pg:",pgs);
        // console.log("Found PGs:", pgs);

        res.json(pgs);

    

})
exports.deletePG =asyncHandler( async (req, res) => {
    
        const pgId = req.params.id;
        console.log(pgId);
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

exports.updatePG =asyncHandler( async (req, res) => {
    
        const pgId = req.params.id;
        const existingPG = await PG.findByPk(pgId);

        if (!existingPG) {
            return res.status(404).json({ message: 'PG not found' });
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
            existingPG.imageUrl = `/uploads/${req.file.filename}`;
        }

        await existingPG.save();

        res.json(existingPG);
   
});

exports.unlockedPG =asyncHandler( async (req, res) => {
   
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
exports.limited =asyncHandler( async (req, res) => {
        const pgs = await PG.findAll({
            limit: 12,
            order: [['createdAt', 'DESC']],
        });
        res.json(pgs);
    
});
exports.allPGs =asyncHandler( async (req, res) => {
    
        const allPgs = await PG.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(allPgs);
    
});



UserUnlockedPGs.belongsTo(PG, { foreignKey: 'pgId' });
PG.hasMany(UserUnlockedPGs, { foreignKey: 'pgId' });


