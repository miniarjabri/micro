const passport = require('passport');
const GoogleStrat = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((data) => {
			done(null, data);
		})
		.catch((err) => {
			console.log('error deserializing user:', err);
		});
});

passport.use(
	new GoogleStrat(
		{
			// options for the Google strat
			callbackURL: '/auth/google/redirect',
			clientID: keys.google.clientID,
			clientSecret: keys.google.clientSecret
		},
		(token, tokenSecret, profile, done) => {
			// passport callback function
			// check DB before creating a new user
			User.findOne({ googleId: profile.id })
				.exec()
				.then((data) => {
					if (data) {
						// user exists in DB already
						console.log('user found in DB:', data);
						done(null, data); // serializes the user
					} else {
						// creating new user in DB
						const user = new User({
							username: profile._json.name,
							googleId: profile._json.sub
						})
							.save()
							.then((data) => {
								console.log('user created success:', data);
								done(null, data); // serializes the user
							})
							.catch((err) => {
								console.log('error creating user:', err);
							});
					}
				})
				.catch((err) => {
					console.log('error occured finding user in the DB:', err);
				});
		}
	)
);
