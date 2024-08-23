import React, { useState } from "react";

const CreatePost = () => {
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    files: null,
  });
  const token = localStorage.getItem("token");
  const host = "http://localhost:8000";

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPostData({
      ...postData,
      [name]: name === "files" ? files : value,
    });
  };

  // Function to handle form submission
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("description", postData.description);
      if (postData.files) {
        Array.from(postData.files).forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await fetch(`${host}/api/blogPost/createPost`, {
        method: "POST",
        headers: {
          "auth-token": token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      const data = await response.json();
      console.log("Post created successfully:", data);
      setPostData({ title: "", description: "", files: null });
      // Optionally handle redirection or reset form
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4">
      <h1 className="text-2xl mb-4">Create a New Post</h1>
      <form
        onSubmit={handleCreatePost}
        className="flex flex-col items-center space-y-4 w-1/2"
      >
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={postData.title}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Post Description"
          value={postData.description}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full"
          required
        />
        <input
          type="file"
          name="files"
          multiple
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
