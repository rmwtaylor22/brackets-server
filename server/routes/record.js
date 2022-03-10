// aquire express 
const express = require('express')

// initialize the application
const app = express()

// cors is middleware, helps communication between the cross origin
const cors = require('cors')
app.use(cors())

// Stringifies the data coming in from the requests
app.use(express.json())

// connect to mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://mern:mongodb@brackets.l3ri0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
const User = require('../models/user.model')
// Login stuff
// const express = require('express');
const cors = require("cors");
const app = express();

try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected"),
  );
} catch (e) {
  console.log("could not connect");
}

app.use("/login", (req, res) => {
  res.send({
    token: "test123",
  });
});

app.listen(3000, () => console.log("API is running on http://localhost:3000"));


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

// This section will help you get a list of all the users.
routes.route("/picks").get(function (req, res) {
  let db_connect = dbo.getDb();
  var mysort = { points: -1 };
  // run python script to update scores
  const { spawn } = require('child_process');
  // const py = spawn('python', ['getScraped.py']);
  const childPython = spawn('python', ['routes/getScraped.py']);

  childPython.stdout.on('data', (data) =>
  {console.log(`stdout: ${data}`);
  })

  childPython.stderr.on('data', (data) =>
  {console.error(`stdout: ${data}`);
  })

  childPython.on('close', (code) =>
  {console.log(`child process exited with code: ${code}`);
  })
  // for future improvement, wait to send data until script finishes running

  db_connect
    .collection("picks")
    .find({})
    .sort(mysort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

routes.route("/games/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("teams")
    .find({ round: 1, bracket: req.params.id })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

routes.route("/games/won").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect.collection("teams").toArray(function (err, result) {
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
routes.route("/user/add").post(async (req, response) => {
  let db_connect = dbo.getDb();
  try {
    await User.create({
      name: req.body.name,
      choices: [
        req.body.choices.d1,
        req.body.choices.d2,
        req.body.choices.d3,
        req.body.choices.d4,
        req.body.choices.d5,
        req.body.choices.d6,
        req.body.choices.d7,
        req.body.choices.d8,
        req.body.choices.d9,
        req.body.choices.d10,
        req.body.choices.d11,
        req.body.choices.d12,
        req.body.choices.d13,
        req.body.choices.d14,
        req.body.choices.d15,
        req.body.choices.d16,
        req.body.choices.d17,
        req.body.choices.d18,
        req.body.choices.d19,
        req.body.choices.d20,
        req.body.choices.d21,
        req.body.choices.d22,
        req.body.choices.d23,
        req.body.choices.d24,
        req.body.choices.d25,
        req.body.choices.d26,
        req.body.choices.d27,
        req.body.choices.d28,
        req.body.choices.d29,
        req.body.choices.d30,
        req.body.choices.d31,
        req.body.choices.d32,
        req.body.choices.d33,
        req.body.choices.d34,
        req.body.choices.d35,
        req.body.choices.d36,
        req.body.choices.d37,
        req.body.choices.d38,
        req.body.choices.d39,
        req.body.choices.d40,
        req.body.choices.d41,
        req.body.choices.d42,
        req.body.choices.d43,
        req.body.choices.d44,
        req.body.choices.d45,
        req.body.choices.d46,
        req.body.choices.d47,
        req.body.choices.d48,
        req.body.choices.d49,
        req.body.choices.d50,
        req.body.choices.d51,
        req.body.choices.d52,
        req.body.choices.d53,
        req.body.choices.d54,
        req.body.choices.d55,
        req.body.choices.d56,
        req.body.choices.d57,
        req.body.choices.d58,
        req.body.choices.d59,
        req.body.choices.d60,
        req.body.choices.d61,
        req.body.choices.d62,
        req.body.choices.d63,
      ],
      points: 0,
      potentialPoints: 0,
      date: Date.now(),
    
    })
    response.json({ status: 'ok' })
  } catch (err) {
    response.json({ status: 'error' , error: 'Duplicate username'})
  }
});

module.exports = routes;
