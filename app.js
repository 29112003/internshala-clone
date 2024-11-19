require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

// db connections
require("./models/database").connectDatabase();

// logger
const logger = require("morgan");
app.use(logger("tiny"))

// body parser 
app.use(express.urlencoded({extended:true}));

// session and cookie

const session = require("express-session")
const cookieParser = require("cookie-parser");
app.use(session({
  resave : true,
  saveUninitialized : true,
  secret : process.env.EXPRESS_SESSION_SECRET
}))
// TO activate cookie 
// we generate an string in backend and save it broswer and jab tak cookie broswer mai save hai tak person login rahega
app.use(cookieParser());

//express file-upload

const fileupload = require("express-fileupload");
app.use(fileupload());

// routes

app.use('/student', require("./routes/indexRouters"));
app.use('/resume', require("./routes/resumeRouters"));
app.use('/employe', require("./routes/employeRouters.js"));


// error handling

const ErrorHandler = require("./utils/errorHandler");
const { genetatedErrors } = require("./middlewares/errors");

app.all("*", (req,res,next)=>{
  next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
})

app.use(genetatedErrors)


app.listen(
  process.env.PORT,
  console.log(`server is running on port ${process.env.PORT}`)
);
