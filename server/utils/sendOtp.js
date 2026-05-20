const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendOtp = async(user) => {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp =await bcrypt.hash(otp,10);

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`
    });

    // console.log("otp sent:",otp);
    return otp;
    

}
module.exports = sendOtp;