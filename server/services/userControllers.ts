import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.ts";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.ts";

const router = express.Router();

router.get("/getUser", verifyToken, async (req, res) => {
  const token = req.headers["authorization"];

  const data = jwt.decode(token.split(" ")[1]) as { mobile: string };

  if (!data) return;

  const user = await prisma.user.findFirst({
    where: {
      mobile: data.mobile,
    },
    select: {
      name: true,
      gender: true,
      email: true,
      createdAt: true,
    },
  });

  return res.json({
    user,
    status: 200,
  });
});

export default router;
