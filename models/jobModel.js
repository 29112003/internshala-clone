const mongoose = require("mongoose");

const jobModel = new mongoose.Schema(
    {
        employe : {
            type : mongoose.Schema.Types.ObjectId, ref : "Employe",
        },
        title:String,
        skill : String,
        jobtype : {type : String , enum : ["In office", "Remote"]},
        openings : Number,
        description : String,
        preferences : String,
        salary : Number,
        perks : String,
        assesments : String,
    }, 
    {timestamps : true}
)

const Job = mongoose.model("job", jobModel);

module.exports = Job;