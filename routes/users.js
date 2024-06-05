import express from "express";
import UserController from "../controllers/users.js";
import UploadMiddleware from "../middlewares/upload.js";

const router = express.Router();

router.patch(
  "/avatars",
  UploadMiddleware.single("avatar"),
  UserController.changeAvatar
);
export default router;
