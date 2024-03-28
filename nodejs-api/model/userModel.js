const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }],
  password: {
    type: String,
    required: true,
    min: 4,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);