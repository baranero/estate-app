import express, { Request, Response } from "express";
import { test, updateUser } from "../controllers/user.controller";
import { verifyUser } from "../utils/verifyUser";

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyUser, updateUser)

export default router;