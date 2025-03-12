const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const Task = mongoose.model("Task", { userId: String, text: String });

const app = express();
app.use(express.json());

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("Access denied");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).send("Invalid token");
    }
};

app.post("/tasks", verifyToken, async (req, res) => {
    const task = new Task({ userId: req.userId, text: req.body.text });
    await task.save();
    res.json(task);
});

app.get("/tasks", verifyToken, async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
});

app.listen(5001, () => console.log("Tasks service running on port 5001"));
