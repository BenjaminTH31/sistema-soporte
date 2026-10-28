
IF DB_ID('SoporteTecnico') IS NULL
BEGIN
    CREATE DATABASE SoporteTecnico;
END;
GO

USE SoporteTecnico;
GO

IF OBJECT_ID('dbo.Tickets', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Tickets (
        id INT IDENTITY(1,1) PRIMARY KEY,
        asunto NVARCHAR(150) NOT NULL,
        solicitante NVARCHAR(100) NOT NULL,
        descripcion NVARCHAR(MAX) NOT NULL,
        categoria NVARCHAR(50) NOT NULL,
        prioridad NVARCHAR(20) NOT NULL,
        estado NVARCHAR(30) NOT NULL
            CONSTRAINT DF_Tickets_Estado DEFAULT 'Pendiente',
        fechaRegistro DATETIME2 NOT NULL
            CONSTRAINT DF_Tickets_Fecha
            DEFAULT SYSDATETIME(),

        CONSTRAINT CK_Tickets_Prioridad
            CHECK (prioridad IN ('Baja', 'Media', 'Alta')),

        CONSTRAINT CK_Tickets_Estado
            CHECK (estado IN (
                'Pendiente',
                'En proceso',
                'Resuelto'
            ))
    );
END;
GO
