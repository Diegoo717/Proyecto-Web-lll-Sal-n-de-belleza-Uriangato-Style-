CREATE DATABASE citasbd;

USE citasbd;

CREATE TABLE Cita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreCompleto VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fechaHora DATETIME NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    servicio VARCHAR(255) NOT NULL
);

ALTER TABLE Cita ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Cita ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

select * from Cita
