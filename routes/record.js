const express = require("express");

// routes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const routes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// Login stuff
// const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());

app.use('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});

app.listen(3000, () => console.log('API is running on http://localhost:3000/login'));

/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// This section will help you get a list of all the users.
routes.route("/user").get(function (req, res) {
  let db_connect = dbo.getDb();
  var mysort = { points: -1 };
  db_connect
    .collection("users")
    .find({})
    .sort(mysort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

routes.route("/games/").get(function (req, res) {
  let db_connect = dbo.getDb();
  var query = { round: 1, bracket: "east" };
  db_connect
    .collection("teams")
    .find(query)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single user by id
routes.route("/user/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you get a single user by username
routes.route("/user/:username").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { username: req.params.username };
  db_connect.collection("users").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new user.
routes.route("/user/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    points: 0,
    date: Date.now()
  };
  /*
  let user = db_connect.collection("users").findOne({username});
  if(user) {
    return res.status(400).json({
      msg: "User Already Exists"
  });
  }
  */
  db_connect.collection("users").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});


// This section will help you get a list of all the users.
routes.route("/team/:region").get(function (req, res) {
  let db_connect = dbo.getDb();
  var query = { round: 1, bracket: req.params.region };
  db_connect
    .collection("teams")
    .find( query , { projection: { _id: 0, 'teamA.name': 1, 'teamB.name': 1 }})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json(result);
    });
});

module.exports = routes;