const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const pool = require('./config/db');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const cors = require('cors');
const keys = require('./config/keys');
const app = express();

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

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
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/spotify', require('./routes/api/spotify'));
app.use('/api/tag', require('./routes/api/tag'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
