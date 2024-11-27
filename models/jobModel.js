const mongoose = require("mongoose");

// Soft-delete logic to exclude documents with isDeleted: true

const excludeSoftDeleted = (schema) => {
  schema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
  });
};

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
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    skill: {
      type: String,
      required: [true, "Skill is required"],
      trim: true,
    },
    jobtype: {
      type: String,
      enum: ["In office", "Remote"],
      required: [true, "Job type is required"],
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, "There should be at least one opening"],
    },
    description: {
      type: String,
      trim: true,
      default: "No description provided",
    },
    preferences: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      default: 0,
    },
    perks: {
      type: String,
      trim: true,
    },
    assessments: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Apply soft-delete filter
excludeSoftDeleted(jobSchema);

// Pre-hook to populate references
jobSchema.pre(/^find/, function (next) {
  this.populate({
    path: "students",
    match: { isDeleted: false },
  }).populate({
    path: "employe",
    match: { isDeleted: false },
  });
  next();
});


const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
