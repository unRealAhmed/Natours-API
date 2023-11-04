const JWT = require("jsonwebtoken");

// Create a JWT token with user's id and set it as a cookie
const createToken = (res, id) => {
  // Create a JWT token
  const token = JWT.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // Configure the options for the cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 90 * 24 * 60 * 60 * 1000, // Maximum age of the cookie (90 days)
  };

  res.cookie("jwt", token, cookieOptions);

  return token;
};

module.exports = createToken;
