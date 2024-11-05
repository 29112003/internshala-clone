const express = require("express");
const { homepage } = require("../controllers/indexController");
const router = express.Router();


// GET / 

router.get("/",homepage )

module.exports = router;
