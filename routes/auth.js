import express from "express";
import Authcontroller from "../controllers/auth.js";
import AuthMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", Authcontroller.register);
router.post("/login", Authcontroller.login);
router.post("/logout", AuthMiddleware, Authcontroller.logout);
router.get("/current", AuthMiddleware, Authcontroller.current);

export default router;
