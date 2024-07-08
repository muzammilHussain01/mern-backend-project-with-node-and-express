require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const bcrypt = require("bcrypt");
const Register = require("./models/registers");
const port = process.env.PORT || 7000;
const staticPath = path.join(__dirname, "../public");
const templatPath = path.join(__dirname, "./templet/views");
const partialPath = path.join(__dirname, "./templet/partials");
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatPath);
hbs.registerPartials(partialPath);
app.use(express.json()); //ye json formate ko use karne ki premission data hai
app.use(express.urlencoded({ extended: false })); //ye page se data lata hai
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmPass = req.body.confirmPass;
    if (password === confirmPass) {
      const newRegister = new Register({
        password: req.body.password,
        confirmPass: req.body.confirmPass,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        number: req.body.number,
        age: req.body.age,
        email: req.body.email,
      });
      const token = await newRegister.genrate_aut_token();
      console.log(`token at app page ${token}`);
      const registerd = await newRegister.save();
      res.status(201).render("index");
    } else {
      res.send("password does not match!");
    }
  } catch (error) {
    res.send(error);
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const email_from_db = await Register.findOne({ email: email });
    const is_Match = await bcrypt.compare(password, email_from_db.password);
    const token = await email_from_db.genrate_aut_token();
    console.log(`token at app page for login ${token}`);
    if (is_Match) {
      // console.log("login successfull");
      res.render("index");
    } else {
      res.status(404).send("Invalid email/password!");
    }
    // res.status(201).send(email_from_db);
  } catch (error) {
    res.status(404).send(error);
  }
  // res.render("login");
});
//creating jwt
// const jwt = require("jsonwebtoken");
// const createToken = async () => {
//   // console.log(jwt);
//   const generatedToken = await jwt.sign(
//     "668916dd6b863d856d1c27f2",
//     "savitasavitasavitasavitasavita"
//   );
//   console.log(generatedToken);
//   const tokenVarify = await jwt.verify(
//     generatedToken,
//     "savitasavitasavitasavitasavita"
//   );
//   console.log(tokenVarify);
// };
// createToken();
app.listen(port, () => {
  console.log(`server is running at port no ${port}!`);
});
