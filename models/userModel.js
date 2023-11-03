const mongoose = require("mongoose");
const { default: validator } = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Create a new mongoose schema for the user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, // Hide password field from query results
  },
  // User's password confirmation
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // Check if password and passwordConfirm match
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  // User account status (active or inactive)
  active: {
    type: Boolean,
    default: true,
    select: false, // Hide active field from query results
  },
});

// Create a mongoose model for the user
const User = mongoose.model("User", userSchema);

module.exports = User;
