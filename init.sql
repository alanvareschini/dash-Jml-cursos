CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

-- senha: 123456
INSERT INTO usuarios (nome, email, senha)
VALUES (
    'Administrador',
    'admin@jml.com',
    '$2y$10$wH7yKJ6D2lQk9eP3l8zV3e2zH7p9c9zQk6g9z8yH5dJf3kL1mN2aW'
);

UPDATE usuarios 
SET senha = '$2y$10$YuSL1ZP4JnDppaz1JH.JWOSfcmxrVW1XCBDqKft7Ko9rTJexNzrj.'
WHERE email = 'admin@jml.com';