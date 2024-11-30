const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwtHelper");

const studentSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [4, "First Name must be at least 4 characters long"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
      minLength: [4, "Last Name must be at least 4 characters long"],
      trim: true,
    },
    contact: {
      type: String,
      unique: true,
      required: [true, "Contact number is required"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Ensures exactly 10 digits
        },
        message: "Contact number must be a valid 10-digit number",
      },
    },
    city: {
      type: String,
      required: [true, "City Name is required"],
      minLength: [3, "City Name must be at least 3 characters long"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required: [true, "Gender is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      unique: true,
      minLength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,15}$/.test(v);
        },
        message:
          "Password must have at least one uppercase letter, one number, and one lowercase letter",
      },
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },
    avatar: {
      type: Object,
      default: {
        fileId: "",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
      },
    },
    resume: {
      education: [{ type: String }],
      jobs: [{ type: String }],
      internships: [{ type: String }],
      extraCurricularActivities: [{ type: String }],
      responsibilities: [{ type: String }],
      courses: [{ type: String }],
      projects: [{ type: String }],
      skills: [{ type: String }],
      accomplishments: [{ type: String }],
    },
    internships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
      },
    ],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Pre-query middleware to exclude soft-deleted records
studentSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Method to generate a JWT token
studentSchema.methods.generateAuthToken = function () {
  return generateToken(this._id); // Uses the helper function to generate token
};

// Export the Student model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
