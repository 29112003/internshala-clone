const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Employe = require("../models/employeModel");
const { passwordStrengthSchema } = require("../utils/passwordHelper");
const { validateEmploye } = require("../validation/employeeValidation");
const ErrorHandler = require("../utils/errorHandler");
const { sendMail } = require("../utils/nodemailer");
const { sendToken } = require("../utils/sendToken");
const imageKit = require("../utils/imageKit").initImageKit();
const path = require("path");
const Internship = require("../models/internshipModel");
const Job = require("../models/jobModel");

// Home route
exports.homepage = catchAsyncErrors(async (req, res) => {
  res.json({ message: "Employe home page" });
});

// Get current logged-in employe
exports.currentUser = catchAsyncErrors(async (req, res) => {
  const employe = await Employe.findById(req.id).exec();
  res.json({ employe });
});

// Employe signup
exports.employeSignup = catchAsyncErrors(async (req, res) => {
  const { error } = validateEmploye(req.body);
  if (error) return res.status(400).json({ errors: error.details.map(err => err.message) });

  const { password } = req.body;
  const { error: passwordError } = passwordStrengthSchema.validate({ password });
  if (passwordError) return res.status(400).json({ error: passwordError.details[0].message });

  const employe = await new Employe(req.body).save();
  const token = employe.generateAuthToken(); 
  sendToken(employe, 200, res);
});

// Employe signin
exports.employeSignin = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email }).select("+password").exec();
  if (!employe) return next(new ErrorHandler("Employe not found with this email address", 404));

  const isMatch = await employe.comparePassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials", 400));

  sendToken(employe, 200, res);
});

// Employe signout
exports.employeSignout = catchAsyncErrors(async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Successfully signed out!" });
});

// Send reset password email
exports.employeSendMail = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email }).exec();
  if (!employe) return next(new ErrorHandler("Employe not found with this email address", 404));

  const url = `${req.protocol}://${req.get("host")}/employe/forget-link/${employe.id}`;
  sendMail(req, res, next, url);

  employe.resetPasswordToken = "1";
  await employe.save();
  res.json({ employe, url });
});

// Reset password using the token
exports.employeForgetLink = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();
  if (!employe || employe.resetPasswordToken !== "1") return next(new ErrorHandler("Invalid or expired reset link", 400));

  employe.resetPasswordToken = "0";
  employe.password = req.body.password;
  await employe.save();

  res.status(200).json({ message: "Password reset successfully" });
});

// Update employe password
exports.employeResetPassword = catchAsyncErrors(async (req, res) => {
  const employe = await Employe.findById(req.id).exec();
  employe.password = req.body.password;
  await employe.save();

  res.status(200).json({ message: "Password updated successfully" });
});

// Update employe details
exports.employeUpdate = catchAsyncErrors(async (req, res) => {
  const { error } = validateEmploye(req.body);
  if (error) return res.status(400).json({ errors: error.details.map(err => err.message) });

  const employe = await Employe.findByIdAndUpdate(req.params.id, req.body).exec();
  await employe.save();
  res.status(200).json({ success: true, message: "Employe updated successfully", employe });
});

// Update employe avatar
exports.employeAvatar = catchAsyncErrors(async (req, res) => {
  const employe = await Employe.findById(req.params.id).exec();
  const file = req.files.organizationLogo;

  const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(file.name)}`;
  if (employe.organizationLogo.fileId) {
    await imageKit.deleteFile(employe.organizationLogo.fileId);
  }

  const { fileId, url } = await imageKit.upload({ file: file.data, fileName: modifiedFileName });
  employe.organizationLogo = { fileId, url };
  await employe.save();

  res.status(200).json({ success: true, message: "Employe avatar updated successfully" });
});

// Soft delete employe
exports.softDeleteEmploye = catchAsyncErrors(async (req, res) => {
  const { empid } = req.params;
  const employe = await Employe.findById(empid);

  if (!employe || employe.isDeleted) {
    return res.status(404).json({ message: "Employe not found or already deleted" });
  }

  employe.isDeleted = true;
  await employe.save();

  await Internship.updateMany({ employe: empid }, { isDeleted: true });
  await Job.updateMany({ employe: empid }, { isDeleted: true });

  res.json({ message: "Employe and related internships/jobs marked as deleted" });
});

// Create internship
exports.createInternship = catchAsyncErrors(async (req, res) => {
  const internship = await new Internship(req.body);
  const employe = await Employe.findById(req.id).exec();

  internship.employe = employe._id;
  employe.internships.push(internship._id);

  await internship.save();
  await employe.save();

  res.status(201).json({ success: true, internship });
});

// read all internship 

exports.readInternship = catchAsyncErrors(async(req,res,next)=>{

  const {internships} = await Employe.findById(req.id).populate("internships").exec();
   
   res.status(200).json({
     success:true,
     internships,
   })
   
 })

//readSingleInternship

exports.readSingleInternship = catchAsyncErrors(async(req,res,next)=>{
    
  const internship = await Internship.findById(req.params.id).exec();

  if(!internship)return new ErrorHandler("internship not found");

  res.status(200).json({
    success:true,
    internship,
  })
  
})

// Soft delete internship
exports.softDeleteInternship = catchAsyncErrors(async (req, res) => {
  const { internshipId } = req.params;
  const internship = await Internship.findById(internshipId);

  if (!internship || internship.isDeleted) {
    return res.status(404).json({ message: "Internship not found or already deleted" });
  }

  const employeId = internship.employe.toString();
  if (employeId !== req.id) {
    return res.status(403).json({ message: "You are not authorized to delete this internship" });
  }

  internship.isDeleted = true;
  await internship.save();

  res.status(200).json({ message: "Internship marked as deleted" });
});

// Create job
exports.createJob = catchAsyncErrors(async (req, res) => {
  const job = await new Job(req.body);
  const employe = await Employe.findById(req.id).exec();

  job.employe = employe._id;
  employe.jobs.push(job._id);

  await job.save();
  await employe.save();

  res.status(201).json({ success: true, job });
});


exports.readJob = catchAsyncErrors(async(req,res,next)=>{

  const {jobs} = await Employe.findById(req.id).populate("jobs").exec();
   
   res.status(200).json({
     success:true,
     jobs,
   })
   
 })

 exports.readSingleJob = catchAsyncErrors(async(req,res,next)=>{
    
  const job = await Job.findById(req.params.id).exec();

  if(!job)return new ErrorHandler("job not found");

  res.status(200).json({
    success:true,
    job,
  })
  
})

// Soft delete job
exports.softDeleteJob = catchAsyncErrors(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);

  if (!job || job.isDeleted) {
    return res.status(404).json({ message: "Job not found or already deleted" });
  }

  const employeId = job.employe.toString();
  if (employeId !== req.id) {
    return res.status(403).json({ message: "You are not authorized to delete this job" });
  }

  job.isDeleted = true;
  await job.save();

  res.status(200).json({ message: "Job marked as deleted" });
});
