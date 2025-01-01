import mongoose from 'mongoose';
import Joi from 'joi';

const schema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const validateProjectModel = (project) => {
    const schema = Joi.object({
      name: Joi.string().trim().lowercase().required(),
      userId: Joi.string().length(24).hex().required()  
    });
    return schema.validate(project);
  };

const projectModel = mongoose.model('Project', schema);

export { projectModel, validateProjectModel};
