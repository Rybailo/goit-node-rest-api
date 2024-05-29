import express from "express";
import Authcontroller from "../controllers/auth.js";

const router = express.Router();

router.post("/register", Authcontroller.register);
router.post("/login", Authcontroller.login);

export default router;
