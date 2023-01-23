import Post from "../models/posts.js";
import User from "../models/users.js";
import { Buffer } from "buffer";
import fs from "fs";

export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const user = await User.findById(userId);

    let picturePath = req.body.picturePath;

    // If a file was uploaded, convert it to base64
    if (req.file) {
      const file = req.file;
      const fileContent = fs.readFileSync(file.path);
      picturePath = new Buffer.from(fileContent).toString("base64");
    } else {
      picturePath = "../Assets/Avatar.png";
    }
    const post = await post.Create({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      description,
      userPicturePath: user.picturePath,
      picturePath: picturePath,
      likes: {},
      comments: [],
    });
    const posts = await find();
    res.status(201).json(post);
    res.status(200).json(posts);
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
      posts.likes.delete(userId);
    } else {
      posts.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
