import express from "express";
import { loginUser, getUser, getWriters } from "../controllers/user.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/user/:id", getUser);
router.get("/writers", getWriters);

export default router;
