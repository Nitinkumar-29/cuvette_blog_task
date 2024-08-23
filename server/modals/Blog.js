const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  media: [
    {
      type: String, // Array of media URLs
    },
  ],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    totalLikes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  saves: {
    totalSaves: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

const BlogPost = mongoose.model("BlogPost", blogSchema);
module.exports = BlogPost;
