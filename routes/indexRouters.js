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
  studentavatar,
  applyinternship,
  applyjob,
  softDeleteStudent
} = require("../controllers/indexController");
const { isAutheticated } = require("../middlewares/auth");

// GET /

// router.get("/", isAutheticated, homepage);/''

// POST /stduent
router.post("/", isAutheticated, currentUser);

// POST  /student/signup
router.post("/signup", studentsignup);

// POST  /student/signin
router.post("/signin", studentsignin);

// GET  /student/signout
router.get("/signout", isAutheticated, studentsignout);

// POST  /student/send-mail
router.post("/send-mail", studentsendmail);

// get  /student/forget-link/:id
router.get("/forget-link/:id", studentforgetlink);

// get  /student/reset-password/:id
router.post(
  "/reset-password/:id",
  isAutheticated,
  studentresetpassword
);

// get  /student/update/:studentid
router.post(
  "/update/:id",
  isAutheticated,
  studentupdate
);

// get  /student/avatar/:studentid
router.post(
  "/avatar/:id",
  isAutheticated,
  studentavatar
);

//---------------------apply internship---------------------

//POST  /student/apply/:internshipid

router.post(
  "/apply/internship/:internshipid",
  isAutheticated,
  applyinternship
);

//---------------------apply job---------------------

//POST  /student/apply/:jobid

router.post(
  "/apply/job/:jobid",
  isAutheticated,
  applyjob
);
//---------------------delete student---------------------

//DELETE  /student/delete/:stuid

router.delete(
  "/delete/:stuid",
  isAutheticated,
  softDeleteStudent
);


module.exports = router;
