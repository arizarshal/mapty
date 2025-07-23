import express from "express";
import workoutRouter from "./routes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/", workoutRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
  next();
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
