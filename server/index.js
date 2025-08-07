const express = require("express");
const { initDB } = require("./models");
const userRoutes = require("./routes/userRoutes");
const pgRoutes = require("./routes/pgRoutes")
const paymentRoutes = require('./routes/paymentRoutes');
const cors = require('cors');
const path = require("path");

const PORT = process.env.PORT || 3009;




const app = express();

require("dotenv").config();
app.use(express.json())
app.use(cors())

initDB();
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/users", userRoutes);
app.use("/api/pgs", pgRoutes);
app.use('/api/payment', paymentRoutes);



app.get("/", (req, res) => {
    res.send("PGLInk backend running 🚀")
})

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})





