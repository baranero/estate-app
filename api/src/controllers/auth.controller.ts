import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error";
import jwt from "jsonwebtoken";

export interface UserDocument {
  _id: string;
  id: string;
  username: string;
  email: string;
  password: string;
  _doc: Record<string, any>;
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (err: any) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const validUser = (await User.findOne({ email })) as UserDocument;
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials!"));
    }
    if (!process.env.JWT_SECRET) {
      return next(errorHandler(500, "JWT_SECRET is not defined"));
    }
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!process.env.JWT_SECRET) {
      return next(errorHandler(500, "JWT_SECRET is not defined"));
    }

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // Exclude the password from the response
      const { password, ...rest } = user.toObject();

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      // Exclude the password from the response
      const { password, ...rest } = newUser.toObject();

      res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!')
  } catch (error) {
    next(error);
  }
};