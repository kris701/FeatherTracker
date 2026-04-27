CREATE PROCEDURE [COR].[GetAllBirds]
AS
BEGIN
    SELECT ID,
           Name,
           Type,
           Icon,
           BirthDate,
           UpdatedAt
    FROM   [COR].[Birds];
END