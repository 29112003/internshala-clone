const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Student = require("../models/studentModel");
const ErrorHandler = require("../utils/errorHandler"); 
const {v4 : uuidv4} = require("uuid");

exports.resume =  catchAsyncErrors(async (req, res, next) => {
    const {resume } = await Student.findById(req.id).exec();
    res.json({ message: "suraksikt resume page", resume });
  });
  
  exports.addeducation = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    student.resume.education.push({...req.body, id:uuidv4()});
    await student.save();
    res.json({ message : "Eduction Added!"  });
  })
  
  
  exports.editeducation = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    const eduIndex = student.resume.education.findIndex((i)=>i.id === req.params.eduid);
    student.resume.education[eduIndex] = {
      ...student.resume.education[eduIndex],
      ...req.body
    }
    await student.save();
    res.json({ message : "Eduction updated!"  });
  })
  
  exports.deleteeducation = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    const filterededu = student.resume.education.filter((i)=>i.id !== req.params.eduid);
    student.resume.education = filterededu;
    await student.save();
    res.json({ message : "Eduction Deteled!"  });
  })


  //----------------------------------------------------------------jobworkexperience------------------------------------------------------------


  exports.addjobworkExperience = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    student.resume.jobs.push({...req.body, id:uuidv4()});
    await student.save();
    res.json({ message : "jobs Added!"  });
  })
  

  exports.editjobworkExperience = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    const jobIndex = student.resume.jobs.findIndex((i)=>i.id === req.params.jobexperid);
    student.resume.jobs[jobIndex] = {
      ...student.resume.jobs[jobIndex],
      ...req.body
    }
    await student.save();
    res.json({ message : "jobs updated!"  });
  })

  
  exports.deleteJobExperience = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    const filteredjob = student.resume.jobs.filter((i)=>i.id !== req.params.jobexperid);
    student.resume.jobs = filteredjob;
    await student.save();
    res.json({ message : "job Deteled!"  });
  })


  


  //----------------------------------------------------------------InternshipEXPERIENCE------------------------------------------------------------


  exports.addInternshipworkExperience = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    student.resume.internship.push({...req.body, id:uuidv4()});
    await student.save();
    res.json({ message : "internship Added!"  });
  })
  

  exports.editInternshipworkExperience = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    const internIndex = student.resume.internship.findIndex((i)=>i.id === req.params.Internshipexperid);
    student.resume.internship[internIndex] = {
      ...student.resume.internship[internIndex],
      ...req.body
    }
    await student.save();
    res.json({ message : "internship updated!"  });
  })

  
  exports.deleteInternshipExperience = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    const filteredintern = student.resume.internship.filter((i)=>i.id !== req.params.Internshipexperid);
    student.resume.internship = filteredintern;
    await student.save();
    res.json({ message : "Internship Deteled!"});
  })


  


  //--------------------------------------------------EXTRA CURRICULAR ACTIVITIES------------------------------------------------------------


  exports.addextraactivities = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    student.resume.extraCurricularActiveties.push({...req.body, id:uuidv4()});
    await student.save();
    res.json({ message : "extraCurricularActiveties Added!"  });
  })

  exports.editextraactivities = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    const extraactivetiesIndex = student.resume.extraCurricularActiveties.findIndex((i)=>i.id === req.params.addextraactivitiesid);
    student.resume.extraCurricularActiveties[extraactivetiesIndex] = {
      ...student.resume.extraCurricularActiveties[extraactivetiesIndex],
      ...req.body
    }
    await student.save();
    res.json({ message : "extraCurricularActiveties updated!"  });
  })
  
  exports.deleteextraactivities = catchAsyncErrors(async (req , res ,next)=>{
    const student = await Student.findById(req.id).exec();
    const filteredActivies = student.resume.extraCurricularActiveties.filter((i)=>i.id !== req.params.addextraactivitiesid);
    student.resume.extraCurricularActiveties = filteredActivies;
    await student.save();
    res.json({ message : "extraCurricularActiveties Deteled!"});
  })


