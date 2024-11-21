const mongoose = require("mongoose");

const excludeSoftDeleted = (schema) =>{
  schema.pre(/^find/ , function (next){
    this.where({isDeleted:false});
    next();
  })
}

const internshipSchema  = new mongoose.Schema(
  {
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      },
    ],
    employe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employe",
    },
    profile: String,
    skill: String,
    internshiptype: { type: String, enum: ["In office", "Remote"] },
    opening: Number,
    from: String,
    to: String,
    duration: String,
    responsibility: String,
    stipend: {
      status: {
        type: String,
        enum: ["Fixed", "Negotiable", "Performance base", "Unpaid"],
      },
      amount: Number,
    },
    perks: String,
    assesments: String,
    isDeleted : { type : Boolean , default : false},
  },
  { timestamps: true }
);

excludeSoftDeleted(internshipSchema);

const Internship = mongoose.model("internship", internshipSchema);

module.exports = Internship;
