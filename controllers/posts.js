import Post from "../models/posts.js";
import User from "../models/users.js";
import { Buffer } from "buffer";
import fs from "fs";

export const createPost = async (req, res) => {
  try {
    const { userId, description, content, title, topic } = req.body;
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
      topic,
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
export const editPost = async (req, res) => {
  const { id } = req.params;
  const { userId, description, content, title, topic } = req.body;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(401).json({ message: "Not authorized to edit post" });
    }

    let picturePath = post.picturePath;

    if (req.file) {
      const file = req.file;
      const fileContent = fs.readFileSync(file.path);
      picturePath = new Buffer.from(fileContent).toString("base64");
    }

    post.description = description;
    post.content = content;
    post.title = title;
    post.topic = topic;
    post.picturePath = picturePath;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    // const posts = await Post.find({ likes: { [userId]: true } });
    const posts = await Post.find({});
    const likedPosts = posts.filter((post) => post.likes.get(userId) === true);
    // const length = posts.length;
    // console.log(length);
    res.status(200).json(likedPosts);
    console.log(`the user ${userId} liked posts`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user-liked posts" });
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add comments
export const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newComment = {
      id: new Date(),
      author: user.firstName + " " + user.lastName,
      photo: user.picturePath,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    console.log(newComment);
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
