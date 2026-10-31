require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const productRoute = require("./routes/productRoute");

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// 1. ADDED THIS LINE: Crucial middleware to read data sent in req.body
app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.log("database connected error", err);
    });

// 2. Your routes are perfectly placed below the middleware
app.use("/", productRoute);

app.get("/", (req, res) => {
    res.send("Hello I am home");
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
