const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordCode: String,
    resetPasswordExpire: Date,
    updatedAt: {
        type: Date,
        default: Date.now()
    },
})

// Encrypt password using bcryptjs
UserSchema.pre('save', async function(){
    let salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

module.exports = mongoose.model('Users', UserSchema)