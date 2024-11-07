const express = require("express");
const router = express.Router();


const { homepage , studentsignup , studentsignin , studentsignout, currentUser} = require("../controllers/indexController");
const { isAutheticated } = require("../middlewares/auth");


// GET / 

router.get("/", isAutheticated , homepage )

// POST /stduent
router.post("/student", isAutheticated , currentUser)


// POST  /student/signup
router.post("/student/signup", studentsignup);

// POST  /student/signin
router.post("/student/signin", studentsignin);

// GET  /student/signout
router.get("/student/signout", isAutheticated , studentsignout);

module.exports = router;
