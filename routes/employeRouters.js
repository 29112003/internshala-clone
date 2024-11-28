const express = require("express");
const router = express.Router();

const {
  homepage,
  employeSignup,
  employeSignin,
  employeSignout,
  currentUser,
  employeSendMail,
  employeForgetLink,
  employeResetPassword,
  employeUpdate,
  employeAvatar,
  createInternship,
  readInternship,
  readSingleInternship,
  createJob,
  readJob,
  readSingleJob,
  softDeleteEmploye,
  softDeleteInternship,
  softDeleteJob
} = require("../controllers/employeController");
const { isAutheticated } = require("../middlewares/auth");

// GET /

router.get("/", isAutheticated, homepage);

// GET /stduent
router.get("/currentEmploye", isAutheticated, currentUser);

// POST  /signup
router.post("/signup", employeSignup);

// POST  /signin
router.post("/signin", employeSignin);

// GET  /employe/signout
router.get("/signout", isAutheticated, employeSignout);

// POST  /send-mail
router.post("/send-mail", employeSendMail);

// get  /employe/forget-link/:id
router.get("/forget-link/:id", employeForgetLink);

// get  /employe/reset-password/:id
router.post(
  "/reset-password/:id",
  isAutheticated,
  employeResetPassword
);

// get  /employe/update/:employeid
router.post(
  "/update/:id",
  isAutheticated,
  employeUpdate
);

// get  /employe/avatar/:employeid
router.post(
  "/avatar/:id",
  isAutheticated,
  employeAvatar
);

//---------------------delete employe---------------------

//DELETE  /employe/delete/:stuid

router.delete(
  "/delete/:empid",
  isAutheticated,
  softDeleteEmploye
);



//------------------------------internship---------------------------

// POST /employe/internship/create

router.post(
  "/internship/create",
  isAutheticated,
  createInternship
);

// POST /employe/internship/read

router.post(
  "/internship/read",
  isAutheticated,
  readInternship
);

// POST /employe/internship/read/:id

router.post(
  "/internship/read/:id",
  isAutheticated,
  readSingleInternship
);


//DELETE  /employe/delete/internship/:internshipId

router.delete(
  "/delete/internship/:internshipId",
  isAutheticated,
  softDeleteInternship
);



//------------------------------job---------------------------

// POST /employe/job/create

router.post(
  "/job/create",
  isAutheticated,
  createJob
);

// POST /employe/job/read

router.post(
  "/job/read",
  isAutheticated,
  readJob
);

// POST /employe/job/read/:id

router.post(
  "/job/read/:id",
  isAutheticated,
  readSingleJob
);



//DELETE  /employe/delete/job/:jobId

router.delete(
  "/delete/job/:jobId",
  isAutheticated,
  softDeleteJob
);




module.exports = router;
