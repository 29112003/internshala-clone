const express = require("express");
const router = express.Router();

const {
  homepage,
  studentsignup,
  studentsignin,
  studentsignout,
  currentUser,
  studentsendmail,
} = require("../controllers/indexController");
const { isAutheticated } = require("../middlewares/auth");

// GET /

router.get("/", isAutheticated, homepage);

// POST /stduent
router.post("/student", isAutheticated, currentUser);

// POST  /student/signup
router.post("/student/signup", studentsignup);

// POST  /student/signin
router.post("/student/signin", studentsignin);

// GET  /student/signout
router.get("/student/signout", isAutheticated, studentsignout);

// POST  /student/send-mail
router.post("/student/send-mail", studentsendmail);

module.exports = router;
