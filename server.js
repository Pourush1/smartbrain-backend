const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controller/register");
const signin = require("./controller/signin");
const profile = require("./controller/profile");
const image = require("./controller/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", //localhost
    user: "postgres",
    password: "Engineer1",
    database: "smartbrain"
  }
});

const app = express();

// db.select()
//   .from("users") //sends back promise object back
//   .then(data => {
//     console.log(data);
//   });

//middleware to use inorder to read json data send from the frontend
app.use(bodyParser.json());
// middleware to use for the cors problem, and also remember about urlEncloded sometimes , it gives problem
app.use(cors());

app.get("/", (req, res) => {
  // console.log("users are", db.users);
  res.send(db.users);
});
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt); //the parameters passed inside handleRegister is called dependencyInjection. Since, we are injecting these dependencies to the handleRegister.
});
// we can omit req, res as it is being called internally, and on the called side we have to write .... look there
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});
// get the image url, we first get the imageUrl because we don't want to show our Claridai api key at the frontend which is very bad.So we keep logic in backend
app.post("/imageLinkUrl", (req, res) => {
  image.handleImageUrl(req, res);
});
//update the profile
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(3000, () => {
  console.log("The server is running on port 3000");
});
//Endpoints needed
// res = this is working
// signin --> POST = successful/fail
// register ==> POST = user
// profile/:userId --> GET = user
// image --> PUT --> user (updates the rank of the user by increasing the links of the images that user have posted)
