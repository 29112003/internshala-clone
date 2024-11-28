const Joi = require("joi");

const validatePasswordStrength = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,15}$/;
  return regex.test(password);
};

const passwordStrengthSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(15)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must have at least one uppercase letter, one number, and one lowercase letter",
      "string.min": "Password should have at least 6 characters",
      "string.max": "Password should not exceed 15 characters",
    }),
});

module.exports = { validatePasswordStrength, passwordStrengthSchema };
