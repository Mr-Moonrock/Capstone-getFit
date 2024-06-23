DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS current_bmi;
DROP TABLE IF EXISTS goal_bmi;
DROP TABLE IF EXISTS calendar;
DROP TABLE IF EXISTS BMR;
DROP TABLE IF EXISTS THR;
DROP TABLE IF EXISTS FFMI;
DROP TABLE IF EXISTS AJBW;
DROP TABLE IF EXISTS bodyfat;
DROP TABLE IF EXISTS user_body_info;


CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_username VARCHAR(50) UNIQUE NOT NULL,
  user_password VARCHAR(200) NOT NULL,
  user_firstName VARCHAR(100) NOT NULL,
  user_lastName VARCHAR(100) NOT NULL,
  user_email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  body_part VARCHAR(255) NOT NULL,
  equipment VARCHAR(255),
  gif_Url VARCHAR(1000),
  name VARCHAR(255) UNIQUE NOT NULL,
  target VARCHAR(255),
  secondary_muscles VARCHAR(255),
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calendar (
  user_id UUID REFERENCES users(user_id),
  exercise_name TEXT NOT NULL,
  exercise_date DATE NOT NULL,
  exercise_day_of_week TEXT NOT NULL,
  exercise_start_time TIME NOT NULL,
  exercise_end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, exercise_date, exercise_start_time),
  UNIQUE (user_id, exercise_date, exercise_start_time)
);

CREATE TABLE BMR (
  user_id UUID REFERENCES users(user_id),
  bmr TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE THR (
  user_id UUID REFERENCES users(user_id),
  thr_max TEXT NOT NULL,
  thr_min TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE FFMI (
  user_id UUID REFERENCES users(user_id),
  FFMI TEXT NOT NULL,
  fat_free_mass TEXT NOT NULL,
  total_body_fat TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AJBW (
  user_id UUID REFERENCES users(user_id),
  AjBW TEXT NOT NULL,
  IBW_Robinson TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bodyFat (
  user_id UUID REFERENCES users(user_id),
  navy_BFP TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_body_info (
  user_id UUID REFERENCES users(user_id),
  user_age TEXT NOT NULL,
  user_weight TEXT NOT NULL,
  user_height TEXT NOT NULL,
  user_gender TEXT NOT NULL,
  user_waist TEXT NOT NULL,
  user_neck TEXT NOT NULL,
  user_hip TEXT NOT NULL,
  user_fitness_level TEXT NOT NULL,
  user_bodyFat TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON exercises
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON calendar
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON BMR
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON THR
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON FFMI
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON AJBW
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON bodyFat
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user_body_info
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();