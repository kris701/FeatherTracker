CREATE TABLE [COR].[Birds] (
    [ID]          UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [Name]        NVARCHAR (MAX)   NOT NULL,
    [Description] NVARCHAR (MAX)   NOT NULL,
    [Type]        NVARCHAR (MAX)   NOT NULL,
    [Icon]        NVARCHAR (MAX)   NOT NULL,
    [BirthDate]   DATETIME         NOT NULL,
    [CreatedAt]   DATETIME         NOT NULL,
    [UpdatedAt]   DATETIME         NULL
);