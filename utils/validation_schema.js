const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().lowercase().min(2).max(10).required(),
    lastName: Joi.string().lowercase().min(2).max(15).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,15}$')).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,15}$')).required()
});

module.exports = {
    registerSchema,
    loginSchema
}