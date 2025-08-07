const { PG, User, UserUnlockedPGs } = require("../models");



exports.createPG = async (req, res) => {
    try {

        //      console.log("Request received");
        // console.log("Body:", req.body);
        // console.log("File:", req.file);
        // let imageUrl;
        // if (req.file) {
        //     imageUrl = `/uploads/${req.file.filename}`;
        // } else {
        //     imageUrl = `/uploads/default.png`;
        // }
        let imageUrl = "/uploads/default.png";

        if (req.file) {
            imageUrl = req.file.path; 
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
    } catch (err) {
        res.status(500).json({ message: "Error creating PG", error: err });
    }
}
// {include:User}
exports.getAllPGs = async (req, res) => {
    const pgs = await PG.findAll({
        include: {
            model: User,
            attributes: ['id', 'name', 'email']
        }
    });
    res.json(pgs)
};

exports.getPGById = async (req, res) => {
    // console.log("Request URL:", req.url);
    const pgId = req.params.id;
    console.log("pgid : ", pgId);
    const pg = await PG.findByPk(pgId);

    res.json(pg);
};

exports.getPGByOwner = async (req, res) => {

    try {
        // console.log("Fetching PGs for ownerId:", req.user.id);
        const pgs = await PG.findAll({
            where: { ownerId: req.user.id }
        })
        // console.log("pg:",pgs);
        // console.log("Found PGs:", pgs);

        res.json(pgs);

    } catch (err) {
        res.status(500).json({ message: "Error fetching PGs by owner", error: err });

    }

}
exports.deletePG = async (req, res) => {
    try {
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


    } catch (err) {
        console.error('Delete PG Error:', err);
        res.status(500).json({ message: 'Server error' });

    }

}

exports.updatePG = async (req, res) => {
    try {
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
    } catch (err) {
        console.error('Update PG Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unlockedPG = async (req, res) => {
    try {
        const userId = req.user.id;

        const unlocked = await UserUnlockedPGs.findAll({
            where: { userId },
            include: [PG]
        });

        const pgList = unlocked.map(entry => entry.PG);
        res.json(pgList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
exports.limited = async (req, res) => {
    try {
        const pgs = await PG.findAll({
            limit: 12,
            order: [['createdAt', 'DESC']],
        });
        res.json(pgs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch PGs' });
    }
};
exports.allPGs = async (req, res) => {
    try {
        const allPgs = await PG.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(allPgs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch all PGs' });
    }
};



UserUnlockedPGs.belongsTo(PG, { foreignKey: 'pgId' });
PG.hasMany(UserUnlockedPGs, { foreignKey: 'pgId' });


