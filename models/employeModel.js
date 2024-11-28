const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {generateToken  } = require("../utils/jwtHelper")
// Mongoose Employee Schema
const employeeSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [4, "First name should be at least 4 characters long"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
      minLength: [4, "Last name should be at least 4 characters long"],
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      maxLength: [10, "Contact must not exceed 10 characters"],
      minLength: [10, "Contact should be at least 10 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      select: false,
      maxLength: [15, "Password should not exceed 15 characters"],
      minLength: [6, "Password should have at least 6 characters"],
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },
    organizationname: {
      type: String,
      required: [true, "Organization Name is required"],
      minLength: [4, "Organization name should be at least 4 characters long"],
    },
    organizationlogo: {
      type: Object,
      default: {
        fileId: "",
        url: "https://defaultlogo.com/logo.png", // default URL
      },
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
employeeSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate JWT token

employeeSchema.methods.generateAuthToken = function () {
  return generateToken(this._id);  // Use the new generateToken function
};

// Soft delete
employeeSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

// Pre-query hook to prevent fetching deleted records
employeeSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// Export Mongoose Model
const Employee = mongoose.model("Employe", employeeSchema);

module.exports = Employee;
