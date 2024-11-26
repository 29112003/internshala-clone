const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Employe = require("../models/employeModel");
const ErrorHandler = require("../utils/errorHandler");
const { sendmail } = require("../utils/nodemailer");
const { sendtoken } = require("../utils/sendToken");
const imageKit = require("../utils/imageKit").initImageKit();
const path = require("path")
const Internship = require("../models/internshipModel")
const Job = require("../models/jobModel")

exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "suraksikt employe home page" });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  res.json({employe})
});

exports.employesignup = catchAsyncErrors(async (req, res, next) => {
  const employe = await new Employe(req.body).save();
  sendtoken(employe , 201 , res)
  // res.status(201).json(student);
});

exports.employesignin = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!employe)
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );

  const isMatch = employe.comparepassword(req.body.password);

  if (!isMatch) {
    return next(new ErrorHandler("Wrong Credientials", 500));
  }

  sendtoken(employe , 200 , res)

  
  // res.json(student);
});

exports.employesignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({message : "Successfully signout!"});
});


exports.employesendmail = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({email : req.body.email}).exec();
  if(!employe){
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );
  }
  const url = `${req.protocol}://${req.get("host")}/employe/forget-link/${employe.id}`

  sendmail(req,res,next,url);

  employe.resetPasswordToken = "1";

  await employe.save();
  res.json({employe, url});
  
});


exports.employeforgetlink = catchAsyncErrors(async(req,res,next)=>{
  const employe = await Employe.findById(req.params.id).exec();
  if(!employe){
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );
  }
  if(employe.resetPasswordToken == "1"){
    employe.resetPasswordToken = "0";
    employe.password = req.body.password;
    await employe.save();
  }else{
    return next(
      new ErrorHandler("Invalid reset password link! Please try again", 500)
    );
  }
  res.status(200).json({message : "password reset successfully"})

})

exports.employeresetpassword = catchAsyncErrors(async(req,res,next)=>{
  
    const employe = await Employe.findById(req.id).exec();
    employe.password = req.body.password;
    await employe.save();
  res.status(200).json({message : "password reset successfully"})

})

exports.employeupdate = catchAsyncErrors(async(req,res,next)=>{
  
    const employe = await Employe.findByIdAndUpdate(req.params.id , req.body).exec();
    await employe.save()
    res.status(200).json({
      success:true,
      // employe,
      message:"employe  updated successfully!"
    })
    
})

exports.employeavatar = catchAsyncErrors(async(req,res,next)=>{
    const employe = await Employe.findById(req.params.id).exec();
    const file = req.files.organizationlogo;
    console.log(file)
    const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
      file.name
    )}`

    if(employe.organizationlogo.fileId !== ""){
      await imageKit.deleteFile(employe.organizationlogo.fileId);
    }

    const {fileId , url } = await imageKit.upload({
      file : file.data,
      fileName : modifiedFileName
    })
    employe.organizationlogo = {fileId , url};
    await employe.save();
    res.status(200).json({
      success : true,
      message : "employe Updated Successfully"
    })
})

// employe soft delete functionality



//-----------------------------soft delete----------------------
exports.softDeleteEmploye = catchAsyncErrors(async (req, res, next) => {
  const { empid } = req.params;

  const employe = await Employe.findById(empid);

  if (!employe || employe.isDeleted) {
    return res.status(404).json({ message: "Employee not found or already deleted" });
  }

  employe.isDeleted = true;
  await employe.save();

  await Internship.updateMany({ employe: empid }, { isDeleted: true });
  await Job.updateMany({ employe: empid }, { isDeleted: true });

  return res.json({ message: "Employee and related internships/jobs marked as deleted" });
});

//----------------------------------Internship-----------------------------------

 //internship created
 exports.createinternship = catchAsyncErrors(async(req,res,next)=>{
   
   const internship = await new Internship(req.body);
   const employe = await Employe.findById(req.id).exec();

   internship.employe = employe._id;
   
   
   employe.internships.push(internship._id);

   await internship.save();
   await employe.save();
   
   res.status(201).json({
     success:true,
     internship,
    })
    
  })
  
  //internship read all
  
  exports.readinternship = catchAsyncErrors(async(req,res,next)=>{

   const {internships} = await Employe.findById(req.id).populate("internships").exec();
    
    res.status(200).json({
      success:true,
      internships,
    })
    
  })
  
  //internship read one
  
  exports.readsingleinternship = catchAsyncErrors(async(req,res,next)=>{
    
  const internship = await Internship.findById(req.params.id).exec();

  if(!internship)return new ErrorHandler("internship not found");

  res.status(200).json({
    success:true,
    internship,
  })
  
})

//--------------------------------------------------jobs---------------------------------------------------

 //job created
 exports.createjob = catchAsyncErrors(async(req,res,next)=>{
   
   const job = await new Job(req.body);
   const employe = await Employe.findById(req.id).exec();

   job.employe = employe._id;
   
   
   employe.jobs.push(job._id);

   await job.save();
   await employe.save();
   
   res.status(201).json({
     success:true,
     job,
    })
    
  })
  
  //job read all
  
  exports.readjob = catchAsyncErrors(async(req,res,next)=>{

   const {jobs} = await Employe.findById(req.id).populate("jobs").exec();
    
    res.status(200).json({
      success:true,
      jobs,
    })
    
  })
  
  //job read one
  
  exports.readsinglejob = catchAsyncErrors(async(req,res,next)=>{
    
  const job = await Job.findById(req.params.id).exec();

  if(!job)return new ErrorHandler("job not found");

  res.status(200).json({
    success:true,
    job,
  })
  
})