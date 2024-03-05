const Joi = require('joi');

const userValidationSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.pattern.base': 'Username can only contain letters and numbers.',
      'string.min': 'Username must be at least {#limit} characters long.',
      'string.max': 'Username cannot be longer than {#limit} characters.',
      'any.required': 'Username is a required field.',
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is a required field.',
    }),

  password: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).',
      'any.required': 'Password is a required field.',
    }),
});

module.exports = userValidationSchema;
