import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  approvedPosts,
  deniedPosts,
  pendingPosts,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/", getFeedPosts);
router.get("/approved", approvedPosts);
router.get("/denied", approvedPosts);
router.get("/pending", approvedPosts);
router.get("userId/posts", getUserPosts);
router.patch("/:id/like", likePost);

export default router;
