const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const internshipSchema = new mongoose.Schema(
  {
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
        required: true, 
      },
    ],
    employe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employe",
      required: true,
    },
    profile: {
      type: String,
      required: [true, "Profile is required"],
      minlength: [5, "Profile should be at least 5 characters long"],
    },
    skill: {
      type: String,
      required: [true, "Skill is required"],
      minlength: [3, "Skill should be at least 3 characters long"],
    },
    internshiptype: {
      type: String,
      enum: ["In office", "Remote"],
      required: [true, "Internship type is required"],
    },
    opening: {
      type: Number,
      required: [true, "Number of openings is required"],
      min: [1, "There must be at least 1 opening"],
    },
    from: {
      type: String,
      required: [true, "Start date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Start date must be in the format YYYY-MM-DD"],
    },
    to: {
      type: String,
      required: [true, "End date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "End date must be in the format YYYY-MM-DD"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      match: [/^\d+ (days|weeks|months)$/, "Duration must be in a valid format like '3 months'"],
    },
    responsibility: {
      type: String,
      required: [true, "Responsibility is required"],
    },
    stipend: {
      status: {
        type: String,
        enum: ["Fixed", "Negotiable", "Performance based", "Unpaid"],
        required: [true, "Stipend status is required"],
      },
      amount: {
        type: Number,
        required: function () {
          return this.stipend.status !== "Unpaid";
        },
        min: [0, "Amount cannot be negative"],
      },
    },
    perks: {
      type: String,
      required: [true, "Perks description is required"],
    },
    assesments: {
      type: String,
      required: [true, "Assessments details are required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    
    secretToken: {
      type: String,
      select: false, 
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      select: false,
    },
  },
  { timestamps: true }
);


internshipSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false }) 
    .populate({
      path: "employe",
      match: { isDeleted: false },
    })
    .populate({
      path: "students",
      match: { isDeleted: false },
    });
  next();
});


internshipSchema.pre("save", async function (next) {
  if (this.isModified("secretToken")) {
    
    const salt = await bcrypt.genSalt(10);
    this.secretToken = await bcrypt.hash(this.secretToken, salt);
  }
  next();
});


internshipSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.lastModified = Date.now();
    this.updatedBy = this._id; 
  }
  next();
});


internshipSchema.methods.verifySecretToken = async function (token) {
  return await bcrypt.compare(token, this.secretToken);
};


internshipSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v; 
    delete ret.isDeleted; 
    delete ret.secretToken; 
    delete ret.updatedBy; 
    return ret;
  },
});

const Internship = mongoose.model("internship", internshipSchema);

module.exports = Internship;
