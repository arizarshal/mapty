USE mapty_app;

CREATE TABLE `workout` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `workout_type` VARCHAR(50) NOT NULL,
    `distance` DECIMAL(6,2) NOT NULL COMMENT 'in kilometers',
    `duration` INT NOT NULL COMMENT 'in minutes',
    `cadence` INT COMMENT 'steps per minute (for running)',
    `elevation_gain` INT COMMENT 'in meters (for cycling)',
    `custom_metrics` JSON COMMENT 'For future workout-specific metrics',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (`workout_type`)
);

INSERT INTO workout (workout_type, distance, duration, elevation_gain) 
VALUES 
('cycling', 55, 30, 20),
('cycling', 49.7, 35.5, 15);