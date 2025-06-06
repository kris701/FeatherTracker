CREATE PROCEDURE [COR].[SP_IsUsernameTaken]
	@Username NVARCHAR(MAX)
AS
BEGIN TRANSACTION
	IF ((SELECT COUNT(*) FROM [COR].[Users] WHERE LoginName = @Username) = 1)
		SELECT 1 AS IsTaken;
	SELECT 0 AS IsTaken;
COMMIT