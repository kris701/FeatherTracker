CREATE TABLE [FOD].[Recipies] (
    [ID]        UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [Name]      NVARCHAR (MAX)   NOT NULL,
    [Recipie]   NVARCHAR (MAX)   NOT NULL,
    [Quantity]  DECIMAL (18, 3)  NULL,
    [Unit]      NVARCHAR (MAX)   NULL,
    [CreatedAt] DATETIME         NOT NULL,
    [UpdatedAt] DATETIME         NULL
);