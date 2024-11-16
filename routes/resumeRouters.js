const express = require("express");
const router = express.Router();

const { resume, addeducation, editeducation, deleteeducation, addjobworkExperience, editjobworkExperience, deleteJobExperience, addInternshipworkExperience , editInternshipworkExperience , deleteInternshipExperience , addextraactivities , editextraactivities , deleteextraactivities , addCourses , editCourses , deleteCourses} = require("../controllers/resumeController");
const { isAutheticated } = require("../middlewares/auth");

// GET /

router.get("/", isAutheticated, resume);

// -------------------------------------------------------------------education------------------------------------------------------------------ 

router.post("/addeducation", isAutheticated, addeducation);
//POST

router.post("/edit-edu/:eduid", isAutheticated, editeducation)
//POST

router.post("/delete-edu/:eduid", isAutheticated, deleteeducation)

// -------------------------------------------------------------------JOB EXPERIENCE------------------------------------------------------------------ 

// POST /addjobworkExperience
router.post("/addjobworkExperience", isAutheticated, addjobworkExperience);

//POST

router.post("/edit-jobexper/:jobexperid", isAutheticated, editjobworkExperience)
//POST

router.post("/delete-jobexper/:jobexperid", isAutheticated, deleteJobExperience)

// -------------------------------------------------------------------InternshipEXPERIENCE------------------------------------------------------------

// POST /addInternshipworkExperience
router.post("/addInternshipworkExperience", isAutheticated, addInternshipworkExperience);

//POST /edit-Internshipexper/:Internshipexperid

router.post("/edit-Internshipexper/:Internshipexperid", isAutheticated, editInternshipworkExperience)

//POST/delete-Internshipexper/:Internshipexperid

router.post("/delete-Internshipexper/:Internshipexperid", isAutheticated, deleteInternshipExperience)




// --------------------------------------------------------EXTRA CURRICULAR ACTIVITIES------------------------------------------------------------

// POST /addextraactivities

router.post("/addextraactivities", isAutheticated, addextraactivities);

//POST /edit-addextraactivities/:addextraactivities

router.post("/edit-addextraactivities/:addextraactivitiesid", isAutheticated, editextraactivities)

//POST/delete-addextraactivities/:addextraactivitiesid

router.post("/delete-addextraactivities/:addextraactivitiesid", isAutheticated, deleteextraactivities)



// --------------------------------------------------------Training and courses------------------------------------------------------------

// POST /addTraining

router.post("/addCourses", isAutheticated, addCourses);

//POST /edit-addTraining/:courseid

router.post("/edit-courses/:courseid", isAutheticated, editCourses)

//POST/delete-courseid/:courseid

router.post("/delete-courses/:courseid", isAutheticated, deleteCourses)





module.exports = router;
