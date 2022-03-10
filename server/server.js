// aquire express
const express = require("express");

// initialize the application
const app = express();

// cors is middleware, helps communication between the cross origin
const cors = require("cors");
app.use(cors());

// Stringifies the data coming in from the requests
app.use(express.json());

// add mongoose
const mongoose = require("mongoose");

const mongoAtlasUri =
  "mongodb+srv://mern:mongodb@brackets.l3ri0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  );
} catch (e) {
  console.log("could not connect");
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

// import user model
const User = require("./models/user.model");

// call some routes

// register
app.post("/api/user/register", async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "Duplicate username" });
  }
});

// login
app.post("/api/user/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = 'secret123';
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

// start the server
app.listen(1337, () => {
  console.log("Server started on 1337");
});
