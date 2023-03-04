import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "This is the title",
    },
    description: {
      type: String,
      default: "This is a description",
    },
    content: {
      type: String,
      default: "This is our content",
    },
    topic: {
      type: String,
      default: "",
    },
    condition: {
      type: String,
      enum: ["draft", "pending", "approved", "declined"],
      default: "pending",
    },
    picturePath: String,
    userPicturePath: String,

    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
