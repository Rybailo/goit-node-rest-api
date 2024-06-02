import express from "express";
import Authcontroller from "../controllers/auth.js";
import AuthMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", Authcontroller.register);
router.post("/login", Authcontroller.login);
router.get("/logout", AuthMiddleware, Authcontroller.logout);
authRouter.get("/current", AuthMiddleware, current);

export default router;
