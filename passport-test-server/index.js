const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(
  session({secret: 'keyboard cat' })
);
app.use(passport.initialize())
app.use(passport.session());
const port = 8000;

// You should use an environment variable for this. I'm just being lazy and doing this for demo purposes
const client_id = "363621222425-u0leq7tdg3d5tlbk1k9h8s7hdgkefrk7.apps.googleusercontent.com";
const client_secret = "HgHIaIAdVi6muR-JpUwrY3FW";

// specify how to serialize user into an ID to store in your passport cookie
passport.serializeUser(function(user, done) {
  console.log("serializing");
  console.log(user);
  console.log("--");
  if (user.name==="Ryan Zhao") {
    done(null, '113519760023286921954');
  } else {
    done(null, '123')
  }
});

// specify how to find the user using the ID stored in the passport cookie. Usually this would be a database lookup based on userID / email
passport.deserializeUser(function(userID, done) {
  console.log("deserializing");
  console.log(userID);
  console.log("--");
  if (userID === '113519760023286921954') {
    done(null, myUser);
  } else {
    done(null, {name: "Random", coolness: "-1"})
  }
});

const myUser = {name: "Ryan Zhao", coolness: "1000"}

passport.use(
  new GoogleStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:8000/google/callback"
  },
  // function that runs on successful google oauth 
  function (accessToken, refreshToken, profile, done) {
    console.log("successfully in callback");
    console.log(profile);
    if (profile.id === '113519760023286921954') {
      return done(null, myUser);
    } else {
      return done(null, {name: "Random", coolness: "-1"})
    }
  })
)

app.get('/', (req, res) => {
  res.send("Hello, World!");
});

app.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));

app.get('/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), function (req, res) {
  res.redirect('http://localhost:3000/?success=true');
})

app.get('/isauth', (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else{
    res.send({text: "NOT AUTHENTICATED"});
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});