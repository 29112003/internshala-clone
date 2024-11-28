const Joi = require("joi");

const employeeValidationSchema = Joi.object({
  firstname: Joi.string().min(4).required(),
  lastname: Joi.string().min(4).required(),
  contact: Joi.string().length(10).required().pattern(/^\d+$/),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(15).required(),
  organizationname: Joi.string().min(4).required(),
  organizationlogo: Joi.object().allow(null),
});

const validateEmploye = (data) => {
  return employeeValidationSchema.validate(data, { abortEarly: false });
};

module.exports = { validateEmploye };
