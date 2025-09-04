const razorpay = require("../config/razorpay");
const { User } = require("../models");
const { UserUnlockedPGs } = require("../models")
const { Payment } = require("../models")
const {Op} = require("sequelize");


exports.createOrder = async (req, res) => {

    const { type } = req.body;
    const amount = type === "single" ? 100 : 1000;



    try {
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: `rcpt_${Math.random()}`,
        })
        // console.log("🧾 Payment values:");
        // console.log("🔐 razorpayOrderId:", order.id);
        // console.log("👤 userId:", req.user?.id);
        // console.log("💰 amount:", order.amount);
        // console.log("📦 type:", type);
        // console.log("🏠 pgId:", type === 'single' ? req.body.pgId : null);
        await Payment.create({
            razorpayOrderId: order.id,
            userId: req.user.id,
            amount: order.amount,
            type,
            pgId: type === 'single' ? req.body.pgId : null
        });
        res.status(201).json({ orderId: order.id, amount: order.amount });


    } catch (err) {
        res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
}

exports.verifyPaymentAndUnlock = async (req, res) => {
    const {  pgId, type } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        const payment = await Payment.findOne({
            where: {
                userId,
                pgId: type === "single" ? pgId : { [Op.is]: null },
                type,
                status: "pending"
            }
        });

        if (payment) {
            payment.status = "success";
            await payment.save();
        }
        if (type === 'subscription') {
            user.isSubscribed = true;
            await user.save();

        } else if (type === 'single') {
            const alreadyUnlocked = await UserUnlockedPGs.findOne({ where: { userId, pgId } })
            if (!alreadyUnlocked) {
                // Set expiration date to 30 days from now
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);
                await UserUnlockedPGs.create({ userId, pgId, expiresAt });
            }
        }
        res.json({ success: true })

    } catch (err) {
        // res.status(500).json({ error: 'Failed to verify payment' });
        res.status(500).json({ error: 'Failed to verify payment', message: err.message });
    }
}