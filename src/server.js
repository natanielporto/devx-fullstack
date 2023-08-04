import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "front/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "front", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.json({ message: "Hello, Express!" });
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`======Server running on port: ${port}======`);
});
