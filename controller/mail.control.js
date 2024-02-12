const express = require("express");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const OAuth2 = google.auth.OAuth2;
const Mail = require("../model/mail.model")

const router = express.Router();

router.post(
  "/mail",
  asyncHandler(async (req, res) => {
    const { name, email, phone, code } = req.body;
    let newMail = new Mail({name , email ,phone : code+" " +phone })
    await newMail.save()
    res.render("index");
  })
);

module.exports = router;
