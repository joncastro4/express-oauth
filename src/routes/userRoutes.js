import { Router } from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authenticateToken, getUserProfile);

export default router;