const { model, Schema } = require("mongoose");

// Create a User schema
const UserSchmea = new Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
  },
  { timestamps: true }
);

// export user model based on the schema
module.exports = model("UserModel", UserSchmea);
