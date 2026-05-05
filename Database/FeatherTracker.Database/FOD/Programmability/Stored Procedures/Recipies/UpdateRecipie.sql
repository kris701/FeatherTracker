CREATE PROCEDURE [FOD].[UpdateRecipie]
@ID UNIQUEIDENTIFIER, @Name NVARCHAR (MAX), @Recipie NVARCHAR (MAX), @Quantity DECIMAL (18, 3), @Unit NVARCHAR (MAX), @Birds [GLB].[GuidListType] READONLY
AS
BEGIN TRANSACTION;

DELETE [FOD].[RecipieBirds]
WHERE  FK_RecipieID = @ID;

UPDATE  [FOD].[Recipies]
    SET Name      = @Name,
        Recipie   = @Recipie,
        Quantity  = @Quantity,
        Unit      = @Unit,
        UpdatedAt = GETUTCDATE()
WHERE   ID = @ID;

INSERT INTO [FOD].[RecipieBirds]
SELECT NEWID(),
       @ID,
       *
FROM   @Birds;

EXECUTE [FOD].[GetRecipie] @ID;

COMMIT TRANSACTION;