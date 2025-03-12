const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour éviter les erreurs CORS
app.use(cors());
app.use(express.json());

// Proxy vers auth-service (port 4000)
app.use("/auth", createProxyMiddleware({
    target: "http://localhost:4000", // Assurez-vous que auth-service tourne bien sur ce port
    changeOrigin: true
}));

app.use("/tasks", createProxyMiddleware({
    target: "http://localhost:5001", 
    changeOrigin: true
}));

// Route de test pour voir si l'API Gateway fonctionne
app.get("/", (req, res) => {
    res.json({ message: "✅ API Gateway is running and ready to proxy requests!" });
});

// Démarrage du serveur API Gateway
app.listen(PORT, () => {
    console.log(`✅ API Gateway running on http://localhost:${PORT}`);
})
app.use((req, res, next) => {
    console.log(`📡 Requête reçue : ${req.method} ${req.originalUrl}`);
    next();
})
;
