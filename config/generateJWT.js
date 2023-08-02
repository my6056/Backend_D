// Importing jwt and secret ket
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// export the generateToken function
module.exports.generateJwtToken = async (userId, fullName, emailId) => {
  return await jwt.sign({ userId, fullName, emailId }, secretKey, {
    expiresIn: "24h",
  });
};
