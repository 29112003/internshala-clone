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