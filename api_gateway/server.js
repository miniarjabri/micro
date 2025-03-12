const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

app.use("/auth", createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL, changeOrigin: true }));
app.use("/tasks", createProxyMiddleware({ target: process.env.TASKS_SERVICE_URL, changeOrigin: true }));

app.listen(3000, () => console.log("API Gateway running on port 3000"));
