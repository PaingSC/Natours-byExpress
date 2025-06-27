const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "A user must have a name"]
      trim: true,
      maxlength: [60, "Max length 60"],
      minxlength: [5, "Max length 60"]
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    }
  }
);
