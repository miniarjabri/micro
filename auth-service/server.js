const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Configuration OAuth2
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    const token = jwt.sign({ userId: profile.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return done(null, { token });
}));

app.get("/auth/github", passport.authenticate("github"));

app.get("/auth/github/callback", passport.authenticate("github"), (req, res) => {
    res.json({ token: req.user.token });
});

app.listen(4000, () => console.log("Auth service running on port 4000"));
