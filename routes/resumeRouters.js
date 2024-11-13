const express = require("express");
const router = express.Router();

const { resume , addeducation , editeducation , deleteeducation } = require("../controllers/resumeController");
const { isAutheticated } = require("../middlewares/auth");

// GET /

router.get("/", isAutheticated , resume);

router.post("/addeducation", isAutheticated , addeducation );

//POST

router.post("/edit-edu/:eduid", isAutheticated , editeducation)
//POST

router.post("/delete-edu/:eduid", isAutheticated , deleteeducation)

module.exports = router;
    