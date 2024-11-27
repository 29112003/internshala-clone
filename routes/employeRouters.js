const express = require("express");
const router = express.Router();

const {
  homepage,
  employesignup,
  employesignin,
  employesignout,
  currentUser,
  employesendmail,
  employeforgetlink,
  employeresetpassword,
  employeupdate,
  employeavatar,
  createinternship,
  readinternship,
  readsingleinternship,
  createjob,
  readjob,
  readsinglejob,
  softDeleteEmploye,
  softDeleteInternshipId,
  softDeleteJobId
} = require("../controllers/employeController");
const { isAutheticated } = require("../middlewares/auth");

// GET /

router.get("/", isAutheticated, homepage);

// GET /stduent
router.get("/currentEmploye", isAutheticated, currentUser);

// POST  /signup
router.post("/signup", employesignup);

// POST  /signin
router.post("/signin", employesignin);

// GET  /employe/signout
router.get("/signout", isAutheticated, employesignout);

// POST  /send-mail
router.post("/send-mail", employesendmail);

// get  /employe/forget-link/:id
router.get("/forget-link/:id", employeforgetlink);

// get  /employe/reset-password/:id
router.post(
  "/reset-password/:id",
  isAutheticated,
  employeresetpassword
);

// get  /employe/update/:employeid
router.post(
  "/update/:id",
  isAutheticated,
  employeupdate
);

// get  /employe/avatar/:employeid
router.post(
  "/avatar/:id",
  isAutheticated,
  employeavatar
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
  createinternship
);

// POST /employe/internship/read

router.post(
  "/internship/read",
  isAutheticated,
  readinternship
);

// POST /employe/internship/read/:id

router.post(
  "/internship/read/:id",
  isAutheticated,
  readsingleinternship
);


//DELETE  /employe/delete/internship/:internshipId

router.delete(
  "/delete/internship/:internshipId",
  isAutheticated,
  softDeleteInternshipId
);



//------------------------------job---------------------------

// POST /employe/job/create

router.post(
  "/job/create",
  isAutheticated,
  createjob
);

// POST /employe/job/read

router.post(
  "/job/read",
  isAutheticated,
  readjob
);

// POST /employe/job/read/:id

router.post(
  "/job/read/:id",
  isAutheticated,
  readsinglejob
);



//DELETE  /employe/delete/job/:jobId

router.delete(
  "/delete/job/:jobId",
  isAutheticated,
  softDeleteJobId
);




module.exports = router;
