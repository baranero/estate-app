import express, { Request, Response } from "express";
import { google, signin, signup, signout } from "../controllers/auth.controller";

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.post('/signout', signout)

export default router;