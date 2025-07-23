import mysql from "mysql2";
import dotenv from "dotenv";
import test from "node:test";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  })
  .promise();

// Testing the database connection on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to the database");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process with failure code
  }
}
testConnection();

// Add event listeners for connection errors
pool.on("connection", (connection) => {
  connection.on("error", (err) => {
    console.error("Database connection error:", err.message);
  });
});

// Verify required environment variables
function checkEnvVariables() {
  const requiredVars = [
    "MYSQL_HOST",
    "MYSQL_USER",
    "MYSQL_PASSWORD",
    "MYSQL_DATABASE",
  ];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      "Missing required environment variables:",
      missingVars.join(", ")
    );
    process.exit(1);
  }
}
checkEnvVariables();

// Function to get all workouts
export async function getWorkouts() {
  const [rows] = await pool.query("SELECT * FROM workout");
  return rows;
}

// Function to get a workout by ID
export async function getWorkout(id) {
  // Doing SQL query this way instead of using template literal, to prevent untrusted "id" to be in the query (Prevents SQL Injection)
  // This syntx is called "PREPARED STATEMENT": where we arrign the valu eseperately, without using traditional JS Template Literal.
  const [row] = await pool.query(
    `
    SELECT * FROM workout WHERE id = ?`,
    [id]
  );
  //returning the object form the array. Itwill return undefined if does not exist
  return row[0];
}

// create a workout
export async function createWorkout(
  workout_type,
  distance,
  duration,
  cadence,
  elevation_gain
) {
  const [result] = await pool.query(
    `INSERT INTO workout (workout_type, distance, duration, cadence,elevation_gain) VALUES (?,?,?,?,?)`,
    [workout_type, distance, duration, cadence, elevation_gain]
  );
  const id = result.insertId;
  return getWorkout(id);
}

// Update specific workout fields
export async function updateWorkout(id, updates) {
  // Allowed fields that can be updated
  const AllowedFields = [
    "workout_type",
    "distance",
    "duration",
    "cadence",
    "elevation_gain",
  ];

  // Filter updates to only include allowed fields
  const validUpdates = {};
  for (const field of AllowedFields) {
    if (updates[field] !== undefined) {
      validUpdates[field] = updates[field];
    }
  }

  // If no valid updates, return the current workout
  if (Object.keys(validUpdates).length === 0) {
    return getWorkout(id);
  }

  // Build the SET clause
  const setClause = Object.keys(validUpdates)
    .map((field) => `${field} = ?`)
    .join(", ");

  const values = Object.values(validUpdates);
  values.push(id); // Add ID for WHERE clause

  const [result] = await pool.query(
    `UPDATE workout SET ${setClause} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) {
    throw new Error("Workout not updated");
  }

  return getWorkout(id);
}

// Delete a workout
export async function deleteWorkout(id) {
  const [result] = await pool.query("DELETE FROM workout WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw new Error("Workout not found");
  }

  return { success: true, message: "Workout deleted" };
}

// const result = await deleteWorkout(7);
// console.log(result);

export default pool;
