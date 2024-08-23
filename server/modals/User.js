const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  profileImage: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  accountCreatedAt: {
    type: Date,
    default: Date.now,
  },
  userVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
