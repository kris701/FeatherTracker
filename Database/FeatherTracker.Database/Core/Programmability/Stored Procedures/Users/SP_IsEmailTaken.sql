CREATE PROCEDURE [COR].[SP_IsEmailTaken]
	@Email NVARCHAR(MAX)
AS
BEGIN TRANSACTION
	IF ((SELECT COUNT(*) FROM [COR].[Users] WHERE Email = @Email) = 1)
		SELECT 1 AS IsTaken;
	SELECT 0 AS IsTaken;
COMMIT