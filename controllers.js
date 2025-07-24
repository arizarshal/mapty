import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "./database.js";

export async function getAllWorkouts(req, res) {
  try {
    const workouts = await getWorkouts();
    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workouts." });
  }
}

export async function getSingleWorkout(req, res) {
  try {
    const id = req.params.id;
    const workout = await getWorkout(id);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found." });
    }
    res.status(200).json(workout);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the workout." });
  }
}

export async function createNewWorkout(req, res) {
  try {
    const { workout_type, distance, duration, cadence, elevation_gain } =
      req.body;

    const workout = await createWorkout(
      workout_type,
      distance,
      duration,
      cadence,
      elevation_gain
    );

    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: "Failed to create workout." });
  }
}

export async function updateWorkoutById(req, res) {
  try {
    const id = req.params.id;
    const updates = req.body;

    const updatedWorkout = await updateWorkout(id, updates);
    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(404).json({ error: error.message || "Workout not updated." });
  }
}

export async function deleteWorkoutById(req, res) {
  try {
    const id = req.params.id;
    const result = await deleteWorkout(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message || "Workout not found." });
  }
}
