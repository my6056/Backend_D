const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const { generateJwtToken } = require("../config/generateJWT");

// User Account Creation function
module.exports.AccountCreate = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.json({
      success: false,
      message: "The password and confirmation password do not match.",
      error: "The password and confirmation password do not match.",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!email && !emailRegex.test(email)) {
    return res.json({
      success: false,
      message: "Enter Valid Email Please.",
      error: "Enter Valid Email Please.",
    });
  }
  if (!passwordRegex.test(password)) {
    return res.json({
      success: false,
      message: "Enter Valid Password with special charector and min 6 digit",
      error: "Enter Valid Password with special charector and min 6 digit",
    });
  }
  //   securing password
  const hashedPassword = await bcryptjs.hash(password, 10);
  //   email valid
  const validEmail = email.toLowerCase();
  try {
    const user = await UserModel.findOne({ email: validEmail });
    if (user) {
      return res.json({
        success: false,
        message: "User Already exists with this email",
        error: "User Already exists with this email",
      });
    }
    const newUser = await new UserModel({
      email: validEmail,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    // saving details in db
    await newUser.save();
    return res.json({
      success: true,
      message: "Account Created Successfully",
      data: newUser,
      error: null,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Login Function

module.exports.LoginUser = async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;
  // Convert email to lowercase for case-insensitive comparison
  const validEmail = email.toLowerCase();
  try {
    // Check if the user exists
    const userExists = await UserModel.findOne({ email: validEmail });
    if (!userExists) {
      return res.json({
        success: false,
        message:
          "User Email Not Found or User Does Not Exist,Please Create New Account",
        error:
          "User Email Not Found or User Does Not Exist,Please Create New Account",
      });
    }
    // Verify the password
    const passwordMatch = await bcryptjs.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.json({
        success: false,
        message: "Incorrect Password Try Again !",
        error: "Incorrect Password Try Again !",
      });
    }
    // generate a token for authentication with expires Time
    const token = await generateJwtToken(
      userExists._id,
      userExists.firstName,
      userExists.lastName,
      userExists.email
    );
    // send success messagae with token
    return res.json({
      success: true,
      message: "Logged in successfull",
      token: token,
      error: null,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
