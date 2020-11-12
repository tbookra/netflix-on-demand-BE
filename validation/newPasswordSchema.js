const Joi = require("@hapi/joi");

const schema = Joi.object({
  email: Joi.string().required().email().max(255),
  new_password: Joi.string().required().max(255),
});

const validateInputAsync = (data) => {
  return schema.validateAsync(data, { abortEarly: false });
};

module.exports = validateInputAsync;
