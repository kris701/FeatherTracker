CREATE PROCEDURE [FOD].[AddRecipie]
@Name NVARCHAR (MAX), @Recipie NVARCHAR (MAX), @Quantity DECIMAL (18, 3), @Unit NVARCHAR (MAX), @Birds [GLB].[GuidListType] READONLY
AS
BEGIN TRANSACTION;

DECLARE @ID AS UNIQUEIDENTIFIER = NEWID();

INSERT  INTO [FOD].[Recipies]
VALUES (@ID, @Name, @Recipie, @Quantity, @Unit, GETUTCDATE(), NULL);

INSERT INTO [FOD].[RecipieBirds]
SELECT NEWID(),
       @ID,
       *
FROM   @Birds;

EXECUTE [FOD].[GetRecipie] @ID;

COMMIT TRANSACTION;