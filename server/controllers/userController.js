const { User, PG } = require("../models");
const generateToken = require("../utils/generateToken");
const bcrypt = require('bcrypt');


exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const user = await User.create({ name, email, password, role });
        const token = generateToken(user.id);
        res.status(201).json({ message: "User created successfully", user, token });
    } catch (err) {
        res.status(500).json({ message: "Error creating user", err });
        // console.error("❌ Error creating user:", err.message, err);  // Add this
        // res.status(500).json({
        //     message: "Error creating user",
        //     errorMessage: err.message,
        //     stack: err.stack // optional: helpful while debugging
        // });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        // if (!user || user.password !== password) {
        //     return res.status(401).json({ message: "Invalid email or password" });
        // }
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = generateToken(user.id);
        res.status(200).json({
            message: "Login successful",
            user,
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in user", err });
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: PG,
                as: "pgs",
                through: {
                    attributes: [],
                    where: {
                        expiresAt: {
                            [require('sequelize').Op.gt]: new Date() // Only include non-expired unlocks
                        }
                    }
                }
            }
        })
        const unlockedPGs = user.pgs.map(pg => pg.id);
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isSubscribed: user.isSubscribed,
            unlockedPGs
        });
        console.log("User from token:", req.user); // see what's coming
        // res.json(req.user);

    } catch (err) {
        res.status(500).json({ message: "Error getting current user", err });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both old and new password required" });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (oldPassword !== user.password) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        user.password = newPassword;

        await user.save();
        res.json({ message: "Profile updated successfully!" });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}
