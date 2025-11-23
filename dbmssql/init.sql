-- =================================================================TABLAS=================================================

-- Create db
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ExpedientesDB')
BEGIN
    CREATE DATABASE ExpedientesDB;
END;
GO

USE ExpedientesDB;
GO

-- Tabla de usuarios
CREATE TABLE Users (
    id INT IDENTITY PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('tecnico', 'coordinador', 'admin')),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- Tabla de expedientes
CREATE TABLE Expedientes (
    id INT IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    fecha_registro DATETIME DEFAULT GETDATE(),
    tecnico_id INT NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('registrando', 'en_revision', 'aprobado', 'rechazado')),
    FOREIGN KEY (tecnico_id) REFERENCES Users(id)
);
GO

-- Tabla de evidencias
CREATE TABLE Evidencias (
    id INT IDENTITY PRIMARY KEY,
    expediente_id INT NOT NULL,
    nombre_objeto VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    color VARCHAR(50),
    tamano VARCHAR(100),
    peso VARCHAR(50),
    ubicacion VARCHAR(150),
    tecnico_id INT NOT NULL,
    fecha_registro DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (expediente_id) REFERENCES Expedientes(id),
    FOREIGN KEY (tecnico_id) REFERENCES Users(id)
);
GO

-- Tabla de revisiones 
CREATE TABLE Reviews (
    id INT IDENTITY PRIMARY KEY,
    expediente_id INT NOT NULL UNIQUE,
    coordinador_id INT NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('aprobado', 'rechazado')),
    justificacion VARCHAR(500),
    fecha_revision DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (expediente_id) REFERENCES Expedientes(id),
    FOREIGN KEY (coordinador_id) REFERENCES Users(id)
);
GO

-- =================================================================PROCEDIMIENTOS=================================================
-- USUARIOS

    -- GET
    CREATE OR ALTER PROCEDURE sp_GetUsers
    AS
    BEGIN
        SELECT id, username, role, created_at
        FROM Users;
    END;
    GO


    -- GET BY ID
    CREATE OR ALTER PROCEDURE sp_GetUserById
        @Id INT
    AS
    BEGIN
        SELECT id, username, role, created_at
        FROM Users
        WHERE id = @Id;
    END;
    GO


    -- CREATE
    CREATE OR ALTER PROCEDURE sp_CreateUser
        @Username VARCHAR(50),
        @PasswordHash VARCHAR(255),
        @Role VARCHAR(20)
    AS
    BEGIN
        INSERT INTO Users (username, password_hash, role)
        VALUES (@Username, @PasswordHash, @Role);

        SELECT id, username, role, created_at
        FROM Users
        WHERE id = SCOPE_IDENTITY();
    END;
    GO

    -- UPDATE
    CREATE OR ALTER PROCEDURE sp_UpdateUser
        @Id INT,
        @Username VARCHAR(50),
        @Role VARCHAR(20)
    AS
    BEGIN
        UPDATE Users
        SET username = @Username,
            role = @Role
        WHERE id = @Id;

        SELECT id, username, role, created_at
        FROM Users
        WHERE id = @Id;
    END;
    GO

    -- DELETE
    CREATE OR ALTER PROCEDURE sp_DeleteUser
        @Id INT
    AS
    BEGIN
        DELETE FROM Users WHERE id = @Id;
    END;
    GO


    CREATE OR ALTER PROCEDURE sp_LoginUser
        @Username VARCHAR(50)
    AS
    BEGIN
        SELECT *
        FROM Users
        WHERE username = @Username;
    END;
    GO

-- EXPEDIENTES

CREATE PROCEDURE sp_CreateExpediente
    @Titulo VARCHAR(150),
    @Descripcion VARCHAR(500),
    @TecnicoId INT
AS
BEGIN
    INSERT INTO Expedientes (titulo, descripcion, tecnico_id, estado)
    VALUES (@Titulo, @Descripcion, @TecnicoId, 'registrando');

    SELECT * FROM Expedientes WHERE id = SCOPE_IDENTITY();
END;
GO

CREATE PROCEDURE sp_GetExpedientes
AS
BEGIN
    SELECT * FROM Expedientes;
END;
GO

CREATE PROCEDURE sp_GetExpedienteById
    @Id INT
AS
BEGIN
    SELECT * FROM Expedientes WHERE id = @Id;
END;
GO

CREATE PROCEDURE sp_UpdateExpediente
    @Id INT,
    @Titulo VARCHAR(150),
    @Descripcion VARCHAR(500),
    @Estado VARCHAR(20)
AS
BEGIN
    UPDATE Expedientes
    SET titulo = @Titulo,
        descripcion = @Descripcion,
        estado = @Estado
    WHERE id = @Id;

    SELECT * FROM Expedientes WHERE id = @Id;
END;
GO

CREATE PROCEDURE sp_DeleteExpediente
    @Id INT
AS
BEGIN
    DELETE FROM Expedientes WHERE id = @Id;
END;
GO



--EVIDENCIAS

CREATE PROCEDURE sp_CreateEvidencia
    @ExpedienteId INT,
    @NombreObjeto VARCHAR(150),
    @Descripcion VARCHAR(500),
    @Color VARCHAR(50),
    @Tamano VARCHAR(100),
    @Peso VARCHAR(50),
    @Ubicacion VARCHAR(150),
    @TecnicoId INT
AS
BEGIN
    INSERT INTO Evidencias (
        expediente_id, nombre_objeto, descripcion, color, tamano, peso, ubicacion, tecnico_id
    )
    VALUES (
        @ExpedienteId, @NombreObjeto, @Descripcion, @Color, @Tamano, @Peso, @Ubicacion, @TecnicoId
    );

    SELECT * FROM Evidencias WHERE id = SCOPE_IDENTITY();
END;
GO

CREATE PROCEDURE sp_GetEvidenciasByExpediente
    @ExpedienteId INT
AS
BEGIN
    SELECT * FROM Evidencias WHERE expediente_id = @ExpedienteId;
END;
GO

CREATE PROCEDURE sp_GetEvidenciaById
    @Id INT
AS
BEGIN
    SELECT * FROM Evidencias WHERE id = @Id;
END;
GO

CREATE PROCEDURE sp_UpdateEvidencia
    @Id INT,
    @NombreObjeto VARCHAR(150),
    @Descripcion VARCHAR(500),
    @Color VARCHAR(50),
    @Tamano VARCHAR(100),
    @Peso VARCHAR(50),
    @Ubicacion VARCHAR(150)
AS
BEGIN
    UPDATE Evidencias
    SET 
        nombre_objeto = @NombreObjeto,
        descripcion = @Descripcion,
        color = @Color,
        tamano = @Tamano,
        peso = @Peso,
        ubicacion = @Ubicacion
    WHERE id = @Id;

    SELECT * FROM Evidencias WHERE id = @Id;
END;
GO

CREATE PROCEDURE sp_DeleteEvidencia
    @Id INT
AS
BEGIN
    DELETE FROM Evidencias WHERE id = @Id;
END;
GO

-- REVISIONES

CREATE OR ALTER PROCEDURE spCreateReview
    @expediente_id INT,
    @coordinador_id INT,
    @estado VARCHAR(20),
    @justificacion VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Reviews WHERE expediente_id = @expediente_id)
    BEGIN
        RAISERROR ('Este expediente ya tiene una revisión registrada.', 16, 1);
        RETURN;
    END

    INSERT INTO Reviews (expediente_id, coordinador_id, estado, justificacion)
    VALUES (@expediente_id, @coordinador_id, @estado, @justificacion);

    SELECT SCOPE_IDENTITY() AS id;
END
GO

CREATE OR ALTER PROCEDURE spGetReviews
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Reviews;
END
GO

CREATE OR ALTER PROCEDURE spGetReviewById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Reviews WHERE id = @id;
END
GO

CREATE OR ALTER PROCEDURE spUpdateReview
    @id INT,
    @estado VARCHAR(20),
    @justificacion VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Reviews
    SET estado = @estado,
        justificacion = @justificacion
    WHERE id = @id;
END
GO

CREATE OR ALTER PROCEDURE spDeleteReview
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Reviews WHERE id = @id;
END
GO

CREATE PROCEDURE spUpdateExpedienteEstado
    @ExpedienteID INT,
    @NuevoEstado VARCHAR(10)  -- 'aprobado' o 'rechazado'
AS
BEGIN
    SET NOCOUNT ON;

    IF @NuevoEstado NOT IN ('aprobado', 'rechazado')
    BEGIN
        RAISERROR('Estado inválido. Debe ser "aprobado" o "rechazado".', 16, 1);
        RETURN;
    END

    UPDATE Expedientes
    SET estado = @NuevoEstado
    WHERE id = @ExpedienteID;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('No se encontró expediente con el ID proporcionado.', 16, 1);
    END
END;
GO


-- =================================================================DATOS INICIALES=================================================
INSERT INTO Users (username, password_hash, Role)
VALUES
('Admin', '$2b$10$BwXtSQHeyjlYJ0eQr5xkzOZ3LUXk86DSM45LKTfAcHj0Ld8iroMWW', 'admin'),
('Tech', '$2b$10$BwXtSQHeyjlYJ0eQr5xkzOZ3LUXk86DSM45LKTfAcHj0Ld8iroMWW', 'tecnico'),
('Coord', '$2b$10$BwXtSQHeyjlYJ0eQr5xkzOZ3LUXk86DSM45LKTfAcHj0Ld8iroMWW', 'coordinador');
GO