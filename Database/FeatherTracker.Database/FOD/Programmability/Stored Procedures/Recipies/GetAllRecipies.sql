CREATE PROCEDURE [FOD].[GetAllRecipies]
AS
BEGIN
    SELECT ID,
           Name,
           CreatedAt,
           UpdatedAt
    FROM   [FOD].[Recipies];
END