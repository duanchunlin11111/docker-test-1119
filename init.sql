CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    age INT,
    height INT,
    address VARCHAR(200),
    nationality VARCHAR(50),
    bio TEXT
);

-- 只在表为空时插入数据
INSERT INTO users (name, email, phone, age, height, address, nationality, bio)
SELECT * FROM (
    SELECT 'Tom', 'tom@example.com', '13800138000', 28, 175, '123 Main Street, New York', 'USA', 'Software Engineer with 5 years experience'
) AS tmp
WHERE NOT EXISTS (
    SELECT * FROM users
) LIMIT 1;

INSERT INTO users (name, email, phone, age, height, address, nationality, bio)
SELECT * FROM (
    SELECT 'Jerry', 'jerry@example.com', '13900139000', 32, 180, '456 Park Avenue, London', 'UK', 'Senior Product Manager, love traveling'
) AS tmp
WHERE NOT EXISTS (
    SELECT * FROM users
) LIMIT 1;