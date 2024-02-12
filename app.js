const express = require("express");
const ejs = require("ejs");
const mailCtl = require("./controller/mail.control");
const app = express();
const port = 3000;
require("dotenv").config();
const session = require("express-session");
const mongoose = require("mongoose");
const Admin = require("./model/admin.model");
const Mail = require("./model/mail.model")
const path = require("path")

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("DB Connected !!");
});

app.set("view engine", "ejs");
app.use(express.static("public")); // Set to the folder containing your static files
app.use("/public", express.static(path.join(__dirname, "public")));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Aydad3d54458s48d48ew4d8e4df8e ",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/admin", (req, res) => {
  res.render("login", { error: null });
});

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
   return res.render("login", { error: "Invalid credentials" });
  }
  try {
    let newAdmin = new Admin(req.body)
    await newAdmin.save()
    const admin = await Admin.findOne({ email, password });
    if (admin) {
      req.session.admin = admin;
      res.redirect("/admin/data");
    } else {
      res.render("login", { error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/admin/data",async (req, res) => {
  if (req.session.admin) {
    let data = await Mail.find()
    res.render("data" , {data});
  } else {
    res.redirect("/login");
  }
});

app.use(mailCtl);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
