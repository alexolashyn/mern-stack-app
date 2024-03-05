const Joi = require('joi');

const postValidationSchema = Joi.object({
  text: Joi.string().required().messages({
    'string.empty': 'Text field cannot be empty!',
    'any.required': 'Text is required!',
  }),
});

module.exports = postValidationSchema;
