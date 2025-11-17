import express from "express";
import cors from "cors";
import AuthRoutes from "./services/authController.ts";
import { authenticateUser, verifyToken } from "./middlewares/authMiddleware.ts";
import UserRoutes from "./services/userControllers.ts";
import QuestionRoutes from "./services/questionController.ts";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", AuthRoutes);

app.use("/api/users", verifyToken, UserRoutes);

app.use("/api/questions", verifyToken, QuestionRoutes);

app.get("/", authenticateUser, (req, res) => {
  res.send(req.body);
});

app.listen(3000, () => {
  console.log("server is runnig on port 3000");
});
