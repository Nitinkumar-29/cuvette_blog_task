const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const Blog = require("../modals/Blog");
const fetchUser = require("../middleware/fetchUser");

// like a post
router.post("/updateLike/:id", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // Find the user and post
    const user = await User.findById(userId);
    const post = await Blog.findById(postId);

    if (!user) {
      return res.status(401).json("Unauthorized access");
    }
    if (!post) {
      return res.status(404).json("Post not found");
    }

    // If the user has already liked the post, remove the like
    if (post.likes.likedBy.includes(userId)) {
      post.likes.likedBy.pull(userId); // Remove userId from likedBy
      post.likes.totalLikes -= 1; // Decrement totalLikes
      await post.save(); // Save the updated post
      return res.status(200).json({ message: "Unliked", post });
    }

    // Otherwise, add the like
    post.likes.likedBy.push(userId); // Add userId to likedBy
    post.likes.totalLikes += 1; // Increment totalLikes
    await post.save(); // Save the updated post

    res.status(200).json({ message: "Liked", post });
    console.log("Likes updated");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
});

// save post
router.post("/updateSave/:id", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // Find the user and post
    const user = await User.findById(userId);
    const post = await Blog.findById(postId);

    if (!user) {
      return res.status(401).json("Unauthorized access");
    }
    if (!post) {
      return res.status(404).json("Post not found");
    }

    // If the user has already liked the post, remove the like
    if (post.saves.savedBy.includes(userId)) {
      post.saves.savedBy.pull(userId); // Remove userId from likedBy
      post.saves.totalSaves -= 1; // Decrement totalLikes
      await post.save(); // Save the updated post
      return res.status(200).json({ message: "Unsaved", post });
    }

    // Otherwise, add the like
    post.saves.savedBy.push(userId); // Add userId to likedBy
    post.saves.totalSaves += 1; // Increment totalLikes
    await post.save(); // Save the updated post

    res.status(200).json({ message: "saved", post });
    console.log("savess updated");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;
