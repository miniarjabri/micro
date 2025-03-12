require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Vérification des variables d'environnement
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  console.error("❌ Erreur : Les variables d'environnement Google OAuth2 ne sont pas définies !");
  process.exit(1);
}

// Initialisation d'Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware de session pour Passport
app.use(session({
  secret: process.env.COOKIE_SECRET || "default_secret",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Configuration de Passport avec Google OAuth2
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Sérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Route pour démarrer l'authentification avec Google
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback après l'authentification Google
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json({ message: "Authentification réussie", user: req.user });
  }
);

// Route pour voir l'utilisateur authentifié
app.get("/auth/user", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  res.json(req.user);
});

// Route pour la déconnexion
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Déconnexion réussie" });
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Auth Service running on http://localhost:${PORT}`);
});
