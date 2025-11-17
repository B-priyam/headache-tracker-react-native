import express from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma/client.ts";
import { getUserUsingJwt } from "../helpers/getUserUsingToken.ts";

const router = express.Router();

router.post("/create", async (req, res) => {
  const {
    symptoms,
    triggers,
    endTime,
    startTime,
    region,
    severity,
    medicine,
    medicinesList,
    recurrence,
    relieve,
    relievedMedicine,
    selectedSense,
  } = req.body;

  const token = req.headers["authorization"];
  const userId = await getUserUsingJwt(token);
  console.log(userId);
  const create = await prisma.headacheEntry.create({
    data: {
      endTime,
      recurrence,
      severity,
      startTime,
      region,
      relieveAfterMedicine: relievedMedicine,
      relievers: relieve,
      sensations: selectedSense,
      triggers,
      symptoms,
      medicines: medicinesList,
      userId: userId,
    },
  });

  if (create) {
    return res.json({
      message: "Data created successfully",
      status: 200,
    });
  } else {
    return res.json({
      message: "Error in creating Data",
      status: 400,
    });
  }
});

router.get("/getQuestions", async (req, res) => {
  const token = req.headers["authorization"];
  const userId = await getUserUsingJwt(token);

  try {
    const data = await prisma.headacheEntry.findMany({
      where: {
        userId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (data) {
      return res.json({
        data: data,
        message: "Data created successfully",
        status: 200,
      });
    } else {
      return res.json({
        message: "Error in getting Data",
        status: 400,
      });
    }
  } catch (error) {
    return res.json({
      message: "Error in getting Data",
      status: 400,
    });
  }
});

export default router;
