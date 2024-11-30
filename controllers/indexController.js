const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Student = require("../models/studentModel");
const Internship = require("../models/internshipModel");
const {validateStudent} = require("../validation/studentValidation")
const Job = require("../models/jobModel");
const ErrorHandler = require("../utils/errorHandler");
const { sendmail } = require("../utils/nodemailer");
const { sendToken } = require("../utils/sendToken");
const imageKit = require("../utils/imageKit").initImageKit();
const path = require("path")

exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "suraksikt home page" });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  res.json({student})
});


exports.studentsignup = catchAsyncErrors(async (req, res, next) => {
  // Validate the incoming request body
  const { error } = validateStudent(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }

  // Check if the email already exists
  const existingStudentByEmail = await Student.findOne({ email: req.body.email });
  if (existingStudentByEmail) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
    });
  }

  // Check if the contact number already exists
  const existingStudentByContact = await Student.findOne({ contact: req.body.contact });
  if (existingStudentByContact) {
    return res.status(400).json({
      success: false,
      message: "Contact number is already registered",
    });
  }

  // Check if the password is already used (if this requirement is strict)
  const existingStudentByPassword = await Student.findOne({ password: req.body.password });
  if (existingStudentByPassword) {
    return res.status(400).json({
      success: false,
      message: "Password has been used already. Choose a different one.",
    });
  }

  // Create a new student document
  const student = await new Student(req.body).save();

  // Generate token
  const token = student.generateAuthToken();

  // Send the token with the response
  sendToken(student, 201, res);
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

exports.studentupdate = catchAsyncErrors(async(req,res,next)=>{
  
    const student = await Student.findByIdAndUpdate(req.params.id , req.body).exec();
    await student.save()
    res.status(200).json({
      success:true,
      student,
      message:"Student  updated successfully!"
    })
    
})

exports.studentavatar = catchAsyncErrors(async(req,res,next)=>{
    const student = await Student.findById(req.params.id).exec();
    const file = req.files.avatar;
    const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
      file.name
    )}`

    if(student.avatar.fileId !== ""){
      await imageKit.deleteFile(student.avatar.fileId);
    }

    const {fileId , url } = await imageKit.upload({
      file : file.data,
      fileName : modifiedFileName
    })
    student.avatar = {fileId , url};
    await student.save();
    res.status(200).json({
      success : true,
      message : "Student Updated Successfully"
    })
})

//-----------------------------apply internship----------------------


exports.applyinternship = catchAsyncErrors(async(req,res,next)=>{
  const student = await Student.findById(req.id).exec();
  const internship = await Internship.findById(
    req.params.internshipid
  ).exec();

  console.log(student)

  student.internships.push(internship._id);
  internship.students.push(student._id);
  await student.save();
  await internship.save();
  res.json({student});
})


//-----------------------------apply job----------------------

exports.applyjob = catchAsyncErrors(async(req,res,next)=>{
  const student = await Student.findById(req.id).exec();
  const job = await Job.findById(
    req.params.jobid
  ).exec();
  student.jobs.push(job._id);
  job.students.push(student._id);
  await student.save();
  await job.save();
  res.json({student});
})


//-----------------------------soft delete----------------------

exports.softDeleteStudent  = catchAsyncErrors(async(req,res,next)=>{
  const  {stuid} = req.params;
  const student = await Student.findById(stuid);

  if(!student || student.isDeleted){
    return res.status(404).json({message : "Student not found or already deleted"}); 
  }
  student.isDeleted  = true;

  await student.save();

  await Internship.updateMany({student : stuid }, {isDeleted : true});
  await Job.updateMany({student : stuid} , {isDeleted : true});
  
  return res.json({student});

})


