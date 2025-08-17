-- USERS table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'commander', 'logistics')),
  base_id INT
);

-- BASES
CREATE TABLE bases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- EQUIPMENT
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  type VARCHAR(50)
);

-- PURCHASES
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  base_id INT REFERENCES bases(id),
  equipment_id INT REFERENCES equipment(id),
  quantity INT,
  purchase_date DATE DEFAULT CURRENT_DATE
);

-- TRANSFERS
CREATE TABLE transfers (
  id SERIAL PRIMARY KEY,
  equipment_id INT REFERENCES equipment(id),
  from_base_id INT REFERENCES bases(id),
  to_base_id INT REFERENCES bases(id),
  quantity INT,
  transfer_date DATE DEFAULT CURRENT_DATE
);

-- ASSIGNMENTS
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  base_id INT REFERENCES bases(id),
  equipment_id INT REFERENCES equipment(id),
  personnel_name VARCHAR(100),
  quantity INT,
  status VARCHAR(20) CHECK (status IN ('assigned', 'expended')),
  assigned_date DATE DEFAULT CURRENT_DATE
);

-- LOGGING
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  user_id INT,
  action TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO bases (name) VALUES ('Base A'), ('Base B');

INSERT INTO equipment (name, type) VALUES 
('Rifle', 'Weapon'), 
('Truck', 'Vehicle');

INSERT INTO users (username, password, role, base_id)
VALUES 
('admin1', 'admin123', 'admin', 1),
('commander1', 'cmd123', 'commander', 1),
('logistics1', 'log123', 'logistics', 1);
