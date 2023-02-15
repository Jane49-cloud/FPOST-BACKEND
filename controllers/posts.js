import Post from "../models/posts.js";
import User from "../models/users.js";
import { Buffer } from "buffer";
import fs from "fs";

export const createPost = async (req, res) => {
  try {
    const { userId, description, content, title } = req.body;
    const user = await User.findById(userId);

    let picturePath = req.body.picturePath;

    // If a file was uploaded, convert it to base64
    if (req.file) {
      const file = req.file;
      const fileContent = fs.readFileSync(file.path);
      picturePath = new Buffer.from(fileContent).toString("base64");
    } else {
      picturePath = "No-Image.jpg";
    }
    const post = await Post.create({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      description,
      content,
      title,
      userPicturePath: user.picturePath,
      picturePath: picturePath,
      likes: {},
      comments: [],
    });
    // const posts = await find();
    res.status(201).json(post);
    // res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.findById(userId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    console.log(userId, "this is actually a comment");

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
    console.log(userId, "this is actually a comment");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const approvedPosts = async (req, res) => {
  try {
    const post = await Post.find({ condition: "approved" });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching approved posts" });
  }
};

export const deniedPosts = async (req, res) => {
  try {
    const post = await Post.find({ condition: "denied" });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching denied posts" });
  }
};

export const pendingPosts = async (req, res) => {
  try {
    const post = await Post.find({ condition: "pending" });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching approved posts" });
  }
};

export const userLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ likes: { [userId]: true } });
    const length = posts.length;
    console.log(length);
    res.status(200).json(posts);
    console.log(`the user ${userId} liked posts`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user-liked posts" });
  }
};
