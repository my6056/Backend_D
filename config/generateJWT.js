// Importing jwt and secret ket
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// export the generateToken function
module.exports.generateJwtToken = async (
  userId,
  lastName,
  firstName,
  email
) => {
  return await jwt.sign({ userId, firstName, lastName, email }, secretKey, {
    expiresIn: "24h",
  });
};
