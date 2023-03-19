import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  approvedPosts,
  deniedPosts,
  pendingPosts,
  userLikedPosts,
  getPost,
  deletePost,
  editPost,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/", getFeedPosts);
router.get("/approved", approvedPosts);
router.get("/denied", deniedPosts);
router.get("/pending", pendingPosts);
router.get("/:userId/liked", userLikedPosts);
router.get("/:userId/posts", getUserPosts);
router.patch("/:id/like", likePost);
router.get("/:id", getPost);
router.patch("/:id", editPost);
// router.patch("/:id/comment", addCommentToPost);
export default router;
