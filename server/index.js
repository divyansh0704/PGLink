const express = require("express");
const { initDB } = require("./models");
const userRoutes = require("./routes/userRoutes");
const pgRoutes = require("./routes/pgRoutes")
const paymentRoutes = require('./routes/paymentRoutes');
const cors = require('cors');
const path = require("path");

const PORT = process.env.PORT || 3009;

const allowedOrigins = [
  "http://localhost:5173",
  "https://pg-link.vercel.app"
];


const app = express();

require("dotenv").config();
app.use(express.json())
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}))

initDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/users", userRoutes);
app.use("/api/pgs", pgRoutes);
app.use('/api/payment', paymentRoutes);



app.get("/", (req, res) => {
    res.send("PGLInk backend running 🚀")
})

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})





