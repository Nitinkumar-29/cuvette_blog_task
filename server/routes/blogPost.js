const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Blog = require("../modals/Blog");
const User = require("../modals/User");
const fetchUser = require("../middleware/fetchUser");
const upload = require("../utils/upload");

// create a blog post
router.post(
  "/createPost",
  upload.array("files", 5),
  [
    body(
      "title",
      "Blog post title is required and should be a string"
    ).isString(),
    body("description", "Blog post description is required").isString(),
  ],
  fetchUser, // Apply fetchUser middleware to ensure the user is authenticated
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, link } = req.body;
      const userId = req.user.id; // Extract the authenticated user's ID from the request

      // Find the user from the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json("Unauthorized access!");
      }

      // collect media urls
      const mediaURLs = req.files ? req.files.map(file => file.path) : []

      // Create a new blog post
      newPost = await Blog.create({
        title: title,
        description: description,
        userId: userId,
        media: mediaURLs,
        saves: { totalSaves: 0, savedBy: [] }, // Initialize as per the schema
        likes: { totalLikes: 0, likedBy: [] }, // Initialize as per the schema
      });

      res.status(200).json(newPost);
      console.log("Post created!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  }
);

// Fetch a post by ID
router.get("/fetchPost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(400).json("Post not found");
    }
    res.status(200).json(post);
    console.log({ post });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal server error");
  }
});

// Edit a post by ID
router.put(
  "/editPost/:id",
  [
    body("title", "Post title is required").isString(),
    body("description", "Post description is required").isString(),
  ],
  fetchUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const { title, description } = req.body;

      // Find the post by ID
      const post = await Blog.findById(postId);
      if (!post) {
        return res.status(404).json("No post found");
      }

      // Check if the logged-in user is the author of the post
      if (post.userId.toString() !== userId) {
        return res.status(401).json("Unauthorized access! Permission denied.");
      }

      // Update the post with new title and description
      post.title = title || post.title;
      post.description = description || post.description;
      post.edited = true;

      // Save the updated post
      const updatedPost = await post.save();

      res.status(200).json(updatedPost);
      console.log("Post updated!", { updatedPost });
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  }
);

// delete a post
router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json("unauthorized access!");
    }
    const post = await Blog.findById(postId);
    if (!post.userId.toString() === userId) {
      return res.status(401).json("unauthorized access, permission denied!");
    }
    if (!post) {
      return res.status(404).json("already deleted by the author");
    }
    await post.deleteOne();
    res.status(200).json({ postId });
    console.log("deleted!", postId);
  } catch (error) {
    console.error(error);
  }
});

// fetch all posts
router.get("/fetchAllPosts", async (req, res) => {
  try {
    const posts = await Blog.find();
    if (posts.length === 0) {
      return res.status(204).json("no data found");
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json("internal server error");
  }
});

module.exports = router;
