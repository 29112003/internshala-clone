const mongoose = require("mongoose");

const jobModel = new mongoose.Schema(
    {
        title:String,
        skill : String,
        jobtype : {type : String , enum : ["In office", "Remote"]},
        opening : Number,
        description : String,
        preferences : String,
        salary : Number,
        perkes : String,
        assesments : String,
    }, 
    {timestamps : true}
)

const Job = mongoose.model("Job", jobModel);

module.exports = Job;