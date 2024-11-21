const mongoose = require("mongoose");

const excludeSoftDeleted = (schema) =>{
  schema.pre(/^find/ , function (next){
    this.where({isDeleted:false});
    next();
  })
}


const jobSchema = new mongoose.Schema(
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
    title: String,
    skill: String,
    jobtype: { type: String, enum: ["In office", "Remote"] },
    openings: Number,
    description: String,
    preferences: String,
    salary: Number,
    perks: String,
    assesments: String,
    isDeleted : {type : Boolean , default : false}
  },
  { timestamps: true }
);

excludeSoftDeleted(jobSchema)

const Job = mongoose.model("job", jobSchema );

module.exports = Job;
