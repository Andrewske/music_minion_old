const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const cors = require('cors');
const keys = require('./config/keys');
const app = express();

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

// const apiTimeout = 10 * 1000;
// app.use((req, res, next) => {
//   // Set the timeout for all HTTP requests
//   req.setTimeout(apiTimeout, () => {
//     let err = new Error('Request Timeout');
//     err.status = 408;
//     next(err);
//   });
//   // Set the server response timeout for all HTTP requests
//   res.setTimeout(apiTimeout, () => {
//     let err = new Error('Service Unavailable');
//     err.status = 503;
//     next(err);
//   });
// });
// Cookie Session
app.use(
  cookieSession({
    name: 'session',
    keys: [keys.session.cookieKey],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(cookieParser());

// Passport Authentication
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

// Cors setup
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
  })
);

//MIDDLEWARE//
app.use(express.json({ extended: false }));

//DEFINE ROUTES//
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
//app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/spotify', require('./routes/api/spotify'));
app.use('/api/tag', require('./routes/api/tag'));
app.use('/api/playlist', require('./routes/api/playlist'));
app.use('/api/track', require('./routes/api/track'));
app.use('/api/artist', require('./routes/api/artist'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
