const mongoose = require("mongoose");

const internshipModel = new mongoose.Schema(
    {
        employe : {
            type : mongoose.Schema.Types.ObjectId, ref : "Employe",
        },
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
        perks : String,
        assesments : String,
    }, 
    {timestamps : true}
)

const Internship = mongoose.model("internship", internshipModel);

module.exports = Internship;