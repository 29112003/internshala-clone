const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Student = require("../models/studentModel");
const ErrorHandler = require("../utils/errorHandler");
const { sendmail } = require("../utils/nodemailer");
const { sendtoken } = require("../utils/sendToken");

exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "suraksikt home page" });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  res.json({student})
});

exports.studentsignup = catchAsyncErrors(async (req, res, next) => {
  const student = await new Student(req.body).save();
  sendtoken(student , 201 , res)
  // res.status(201).json(student);
});

exports.studentsignin = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!student)
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );

  const isMatch = student.comparepassword(req.body.password);

  if (!isMatch) {
    return next(new ErrorHandler("Wrong Credientials", 500));
  }

  sendtoken(student , 200 , res)

  
  // res.json(student);
});

exports.studentsignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({message : "Successfully signout!"});
});


exports.studentsendmail = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({email : req.body.email}).exec();
  if(!student){
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );
  }
  const url = `${req.protocol}://${req.get("host")}/student/forget-link/${student.id}`

  sendmail(req,res,next,url);

  student.resetPasswordToken = "1";

  await student.save();
  res.json({student, url});
  
});


exports.studentforgetlink = catchAsyncErrors(async(req,res,next)=>{
  const student = await Student.findById(req.params.id).exec();
  if(!student){
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );
  }
  if(student.resetPasswordToken == "1"){
    student.resetPasswordToken = "0";
    student.password = req.body.password;
    await student.save();
  }else{
    return next(
      new ErrorHandler("Invalid reset password link! Please try again", 500)
    );
  }
  res.status(200).json({message : "password reset successfully"})

})

exports.studentresetpassword = catchAsyncErrors(async(req,res,next)=>{
  
    const student = await Student.findById(req.id).exec();
    student.password = req.body.password;
    await student.save();
  res.status(200).json({message : "password reset successfully"})

})