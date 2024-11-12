const express = require("express");
const router = express.Router();

const {
  homepage,
  studentsignup,
  studentsignin,
  studentsignout,
  currentUser,
  studentsendmail,
  studentforgetlink,
  studentresetpassword,
  studentupdate,
  studentavatar
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

// get  /student/forget-link/:id
router.get("/student/forget-link/:id", studentforgetlink);

// get  /student/reset-password/:id
router.post(
  "/student/reset-password/:id",
  isAutheticated,
  studentresetpassword
);

// get  /student/update/:studentid
router.post(
  "/student/update/:id",
  isAutheticated,
  studentupdate
);

// get  /student/avatar/:studentid
router.post(
  "/student/avatar/:id",
  isAutheticated,
  studentavatar
);

module.exports = router;
