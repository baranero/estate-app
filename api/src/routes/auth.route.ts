import express, { Request, Response } from "express";
import { signup } from "../controllers/auth.controller";

const router = express.Router();

router.post('/signup', signup);

export default router;