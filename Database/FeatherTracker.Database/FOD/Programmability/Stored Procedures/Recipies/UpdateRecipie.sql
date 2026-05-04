CREATE PROCEDURE [FOD].[UpdateRecipie]
@ID UNIQUEIDENTIFIER, @Name NVARCHAR (MAX), @Recipie NVARCHAR (MAX), @Quantity DECIMAL (18, 3), @Unit NVARCHAR (MAX)
AS
BEGIN TRANSACTION;

UPDATE  [FOD].[Recipies]
    SET Name     = @Name,
        Recipie  = @Recipie,
        Quantity = @Quantity,
        Unit     = @Unit
WHERE   ID = @ID;

EXECUTE [FOD].[GetRecipie] @ID;

COMMIT TRANSACTION;