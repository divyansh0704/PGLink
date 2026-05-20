const { User, PG } = require("../models");
const generateToken = require("../utils/generateToken");
const bcrypt = require('bcrypt');
const asyncHandler = require("../utils/asyncHandler");
const sendOtp = require("../utils/sendOtp")



exports.register = asyncHandler(async (req, res) => {

    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "Already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    const token = generateToken(user.id);

    await sendOtp(user);
    res.status(201).json({ message: "User created successfully", user, token });

})

exports.login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password" });
    }
    const token = generateToken(user.id);
    res.status(200).json({
        message: "Login successful",
        user,
        token
    });

})

exports.getCurrentUser = asyncHandler(async (req, res) => {

    const user = await User.findByPk(req.user.id, {
        include: {
            model: PG,
            as: "pgs",
            through: {
                attributes: [],
                where: {
                    expiresAt: {
                        [require('sequelize').Op.gt]: new Date()
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
    // console.log("User from token:", req.user); 
    // res.json(req.user);


})

exports.updateUser = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new password required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
        return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();
    res.json({ message: "Profile updated successfully!" });


})
exports.updateProfile = asyncHandler(async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByPk(req.user.id);
        const checkemail = await User.findOne({ where: { email } });
        if (checkemail && checkemail.id !== user.id) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (!user) return res.status(404).json({ message: "User not found" });
        user.name = name;
        user.email = email;
        await user.save();
        res.json({ message: "Profile updated successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }

})

exports.verifyOtp = async (req, res) => {

    try {

        const {  otp } = req.body;
        const user = await User.findByPk(req.user.id);
        

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // check otp exists
        if (!user.otp) {
            return res.status(400).json({
                message: "No OTP found"
            });
        }


        if (Date.now() > user.otpExpiry) {

            return res.status(400).json({
                message: "OTP expired"
            });
        }


        const isMatch = await bcrypt.compare(
            otp,
            user.otp
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }


        user.isVerified = true;


        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
}

exports.resendOtp = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user.isVerified) {
        return res.status(400).json({
            message: "User already verified"
        });
    }

    await sendOtp(user);

    res.status(200).json({
        message: "New OTP sent"
    });
});
