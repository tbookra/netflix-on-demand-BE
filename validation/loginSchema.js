const Joi = require("@hapi/joi");

const schema = Joi.object({
  email: Joi.string().required().email().max(255),
  password: Joi.string().required().max(1024),
  rememberMe: Joi.bool().required(),
});

const validateInputAsync = (data) => {
  return schema.validateAsync(data, { abortEarly: false });
};

module.exports = validateInputAsync;
