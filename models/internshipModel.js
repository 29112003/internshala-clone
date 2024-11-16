const mongoose = require("mongoose");

const internshipModel = new mongoose.Schema(
    {
        profile:String,
        skill : String,
        internshiptype : {type : String , enum : ["In office", "Remote"]},
        opening : Number,
        from : String,
        to : String , 
        duration : String,
        responsibility : String,
        stipend : {
            status : {
                type : String, 
                enum : ["Fixed", "Negotiable", "Performance base", "Unpaid"]
            },
            amount : Number
        },
        perkes : String,
        assesments : String,
    }, 
    {timestamps : true}
)

const Internship = mongoose.model("Internship", internshipModel);

module.exports = Internship;