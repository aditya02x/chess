import type { Request, Response } from "express";
import User from "../models/User.model.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isMainThread } from "node:worker_threads";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      passwordHash,
    });

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({ message: "Server misconfiguration" });
      return;
    }

    const token = jwt.sign(
      { userId: newUser._id },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        rating: newUser.rating,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
};

interface loginBody{
    email:string,
    password:string
};


export const login= async ( req:Request<unknown, unknown, RegisterBody>,
    res:Response
): Promise<void> => {
    try {
         const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    
     const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ message: "Server misconfiguration" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        rating: user.rating,
      },
    });



    } catch (err) {
        res.status(500).json({message:"Something went wrong ", error: (err as Error).message})
    }
}

export const getMe