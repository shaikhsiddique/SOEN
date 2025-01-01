import mongoose from 'mongoose';
import joi from 'joi';

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: [6, 'Email must be at least 6 characters long'],
    maxlength: [50, 'Email must be at most 50 characters long'],
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Validate user input data using Joi
const validateUserModel = (data) => {
  const schema = joi.object({
    email: joi.string().email().min(6).max(50).required().messages({
      'string.email': 'Invalid email format.',
      'string.empty': 'Email cannot be empty.',
      'string.min': 'Email must be at least 6 characters long.',
      'string.max': 'Email must be at most 50 characters long.',
      'any.required': 'Email is required.',
    }),
    password: joi.string().min(6).required().messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

// Create the user model
const userModel = mongoose.model('User', userSchema);

// Export the user model and validation function
export { userModel, validateUserModel };
