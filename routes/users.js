import express from "express";
import { loginUser, getUser, getUsers } from "../controllers/user.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/user/:id", getUser);
router.get("/all_users", getUsers);

export default router;
