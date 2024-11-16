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
  employeavatar
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

module.exports = router;
