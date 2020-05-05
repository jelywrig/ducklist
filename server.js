// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const morgan        = require('morgan');
const cookieSession = require('cookie-session');
// for socket.io
const http          = require('http').createServer(app);
const io            = require('socket.io')(http);

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(cookieSession({
  name: 'session',
  keys: ['midterm'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
const listingsRouter = require("./routes/listings");
const messagesRouter = require("./routes/messages");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api", usersRoutes(db));
app.use("/api/listings", listingsRouter(db));
app.use("/api/messages", messagesRouter(db));

// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  const templateVars = {
    user: req.session.user_id,
    is_admin: req.session.is_admin
  };
  res.render("index", templateVars);
});

app.get('/login/:id', (req, res) => {
  req.session.user_id = req.params.id;
  db.query('SELECT is_admin FROM users WHERE id = $1', [req.params.id]).then(function (data) {
    req.session.is_admin = data.rows[0].is_admin;
    res.redirect('/');
  });

});

app.get('/logout', (req,res) => {
  req.session.user_id = undefined;
  req.session.is_admin = undefined;
  res.redirect('/');
});


// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });
//socket.io
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (msg) => {
    console.log('message: ', msg);
    socket.broadcast.emit('message', msg);
  })
});
http.listen(8080,() => {
  console.log('http listening on 8080');
})
