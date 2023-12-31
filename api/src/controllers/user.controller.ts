import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/error";
import bcryptjs from "bcryptjs";
import User from "../models/user.model";
import { UserDocument } from "./auth.controller";
import Listing from "../models/listing.model";

export const test = (req: Request, res: Response) => {
  res.json({
    message: "API route is working!",
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = (await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    )) as UserDocument;

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id) as UserDocument;

    if (!user) return next(errorHandler(404, "User not found!"));
  
    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};