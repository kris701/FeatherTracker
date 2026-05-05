CREATE PROCEDURE [FOD].[GetRecipie]
@ID UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM   [FOD].[Recipies]
    WHERE  ID = @ID;
    
    SELECT FK_BirdID
    FROM   [FOD].[RecipieBirds]
    WHERE  FK_RecipieID = @ID;
END