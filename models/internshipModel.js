const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Middleware for soft-deletion and population
internshipSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false }) // Exclude soft-deleted documents
    .populate({
      path: "employe",
      match: { isDeleted: false }, // Filter out soft-deleted employees
    })
    .populate({
      path: "students",
      match: { isDeleted: false }, // Filter out soft-deleted students
    });
  next();
});

const Internship = mongoose.model("internship", internshipSchema);

module.exports = Internship;
