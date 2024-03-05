const Joi = require('joi');
const { checkCountryExistence } = require('../location');

const countryExistenceValidation = async (value, helpers) => {
  try {
    if (value) {
      const exists = await checkCountryExistence(value);
      if (exists) {
        return value;
      }

      return helpers.message({ external: 'Provided country does not exists!' });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const profileValidationSchema = Joi.object({
  age: Joi.number().min(13).max(150).messages({
    'number.min':
      'You should be at least 13 years old to have the opportunity to create your profile here!',
    'number.max': 'Provided value is not valid',
  }),
  location: Joi.string().allow('').external(countryExistenceValidation),
  hobbies: Joi.array().items(Joi.string().allow('')),
  bio: Joi.string().max(100).messages({
    'string.max': 'Your bio cannot be longer than 100 characters',
  }),
  website: Joi.string().allow(''), // add check with google safe browsing api
  education: Joi.array().items(
    Joi.object({
      school: Joi.string().required().messages({
        'string.empty': 'School field cannot be empty!',
      }),
      degree: Joi.string().required().messages({
        'string.empty': 'Degree field cannot be empty!',
      }),
      fieldOfStudy: Joi.string().required().messages({
        'string.empty': 'Field of study field cannot be empty!',
      }),
      from: Joi.date().iso().greater('1880-01-01').required().messages({
        'date.iso': 'Please use ISO format!',
        'date.greater': 'Provided value is not valid for from-date field!',
      }),
      to: Joi.date().iso().greater(Joi.ref('from')).required().messages({
        'date.iso': 'Please use ISO format!',
        'date.greater': 'Provided value is not valid for to-date field!',
      }),
    }).messages({
      'any.required':
        "If you'd like to add data about your education please fill in all fields!",
    })
  ),
  social: Joi.object({
    youtube: Joi.string().allow(''),
    facebook: Joi.string().allow(''),
    instagram: Joi.string().allow(''),
  }),
});

module.exports = profileValidationSchema;
