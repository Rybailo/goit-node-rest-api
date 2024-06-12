import express from "express";
import UserController from "../controllers/users.js";
import UploadMiddleware from "../middlewares/upload.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.patch(
  "/avatars",
  authMiddleware,
  UploadMiddleware.single("avatar"),
  UserController.changeAvatar
);
router.get("/verify/:token", UserController.verifyEmail);
router.post("/verify", UserController.resendVerificationEmail);

export default router;
