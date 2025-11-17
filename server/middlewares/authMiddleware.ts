import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Children } from "react";
const JWT_SECRET = process.env.JWT_SECRET as string;

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];

  const tokenExists = authHeader && authHeader.split(" ")[1];
  const user = req.body;

  if (!tokenExists) {
    return res.status(404).json({
      message: "token not available",
    });
  }
  try {
    const decoded = jwt.verify(tokenExists, JWT_SECRET) as { mobile: string };
    if (user.mobile === decoded.mobile) {
      next();
    }
  } catch (error) {
    return res.status(403).json({
      message: "unauthorised user",
    });
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const tokenExists = authHeader && authHeader.split(" ")[1];
  if (!tokenExists) {
    return res.json({
      message: "token not provided",
      status: 404,
    });
  }

  try {
    const decoded = jwt.verify(tokenExists, JWT_SECRET);
    if (!decoded) {
      return res.json({
        message: "from here unauthorised user",
        status: 400,
      });
    }
    next();
  } catch (error) {
    return res.json({
      message: "unauthorised user here",
      status: 400,
    });
  }
}
