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
    // default: "default.jpg",
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
//

//COMAPREING PASSWORDS
userSchema.methods.passwordMatching = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

//PASSWORD CHANGE CHECKER
userSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt timestamp to seconds
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};


//HASH PASSWORD
userSchema.pre('save', async function (next) {
  // Check if the password field has been modified (e.g., during user registration or update)
  if (!this.isModified('password')) return next();
  try {
    // Generate a salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);

    // Set passwordConfirm to undefined as it's no longer needed
    this.passwordConfirm = undefined;

    if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
    next();
  } catch (error) {
    return next(error);
  }
});

//PASSWORD RESET TOKEN GENERATOR
userSchema.methods.createPasswordResetToken = function () {
  // Generate a random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and set it on the user
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set an expiration time for the token (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return the unhashed token for use in the email
  return resetToken;
};


// Create a mongoose model for the user
const User = mongoose.model("User", userSchema);

module.exports = User;
