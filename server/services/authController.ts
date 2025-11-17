import express from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma/client.ts";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

router.post("/register", async (req, res) => {
  const { name, mobile, email, password, age, doctor, gender } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ mobile }, { email }],
    },
  });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "user already exists", status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      age,
      doctor,
      email,
      mobile,
      name,
      gender,
      password: hashedPassword,
    },
  });

  if (user) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.status(201).json({
      token,
      message: "user created successfully",
      status: 201,
      user: {
        name: user.name,
        gender: user.gender,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  }
});

router.post("/login", async (req, res) => {
  const { mobile, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      mobile,
    },
  });
  if (!user) {
    return res.status(404).json({ message: "user not found", status: 400 });
  }

  const isPasswordMatching = await bcrypt.compare(password, user.password);

  if (!isPasswordMatching) {
    return res
      .status(404)
      .json({ message: "Invalid Credentials", status: 400 });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET);

  return res.status(200).json({
    token,
    message: "Login successful",
    status: 200,
    user: {
      name: user.name,
      gender: user.gender,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

export default router;
