import express from "express";
import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "./database.js";

const router = express.Router();

router.get("/workouts", async (req, res) => {
  const workouts = await getWorkouts();
  res.send(workouts);
});

router.get("/workouts/:id", async (req, res) => {
  const id = req.params.id;
  const workout = await getWorkout(id);
  res.send(workout);
});

router.post("/workouts", async (req, res) => {
  const { workout_type, distance, duration, cadence, elevation_gain } =
    req.body;
  const workout = await createWorkout(
    workout_type,
    distance,
    duration,
    cadence,
    elevation_gain
  );
  res.status(201).send(workout);
});

router.delete("/workouts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteWorkout(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.patch("/workouts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedWorkout = await updateWorkout(id, updates);
    res.status(200).send(updatedWorkout);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

export default router;
