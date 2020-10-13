const Joi = require("@hapi/joi");

const schema = Joi.object({
  full_name: Joi.string().required().max(255),
  email: Joi.string().required().email().max(255),
  password: Joi.string().required().max(1024),
  rememberMe: Joi.bool().required(),
});

const validateInputAsync = (data) => {
  return schema.validateAsync(data, { abortEarly: false });
};

module.exports = validateInputAsync;
