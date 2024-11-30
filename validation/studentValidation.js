const Joi = require("joi");

const studentValidationSchema = Joi.object({
  firstname: Joi.string()
    .min(4)
    .required()
    .messages({
      "string.base": "First Name must be a string",
      "string.min": "First Name must be at least 4 characters long",
      "any.required": "First Name is required",
    }),
  lastname: Joi.string()
    .min(4)
    .required()
    .messages({
      "string.base": "Last Name must be a string",
      "string.min": "Last Name must be at least 4 characters long",
      "any.required": "Last Name is required",
    }),
  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact must be a valid 10-digit number",
      "any.required": "Contact is required",
    }),
  city: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.base": "City Name must be a string",
      "string.min": "City Name must be at least 3 characters long",
      "any.required": "City Name is required",
    }),
  gender: Joi.string()
    .valid("Male", "Female", "Others")
    .required()
    .messages({
      "any.only": "Gender must be Male, Female, or Others",
      "any.required": "Gender is required",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 15 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Password is required",
    }),
  avatar: Joi.object({
    fileId: Joi.string().allow(""),
    url: Joi.string().uri(),
  }).default({
    fileId: "",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  }),
  resume: Joi.object({
    education: Joi.array().items(Joi.string()),
    jobs: Joi.array().items(Joi.string()),
    internships: Joi.array().items(Joi.string()),
    extraCurricularActivities: Joi.array().items(Joi.string()),
    responsibilities: Joi.array().items(Joi.string()),
    courses: Joi.array().items(Joi.string()),
    projects: Joi.array().items(Joi.string()),
    skills: Joi.array().items(Joi.string()),
    accomplishments: Joi.array().items(Joi.string()),
  }).default({
    education: [],
    jobs: [],
    internships: [],
    extraCurricularActivities: [],
    responsibilities: [],
    courses: [],
    projects: [],
    skills: [],
    accomplishments: [],
  }),
  internships: Joi.array().items(Joi.string().hex().length(24)), // MongoDB ObjectId validation
  jobs: Joi.array().items(Joi.string().hex().length(24)), // MongoDB ObjectId validation
});


const validateStudent = (data) => {
    return studentValidationSchema.validate(data, { abortEarly: false });
  };
  
module.exports = { validateStudent };