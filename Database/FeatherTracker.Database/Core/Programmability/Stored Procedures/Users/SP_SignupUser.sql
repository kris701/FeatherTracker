CREATE PROCEDURE [COR].[SP_SignupUser]
	@FirstName NVARCHAR(MAX),
	@LastName NVARCHAR(MAX),
	@Email NVARCHAR(MAX),
	@LoginName NVARCHAR(100),
	@Password NVARCHAR(MAX)
AS
BEGIN TRANSACTION
	DECLARE @ID UNIQUEIDENTIFIER = NEWID()
	INSERT INTO [COR].[Users] VALUES (@ID, @FirstName, @LastName, @Email, @LoginName, @Password, 1, 0, GETUTCDATE(), NULL);
	INSERT INTO [COR].[UserPermissions] SELECT NEWID(), @ID, A.PK_ID FROM [COR].[Permissions] AS A WHERE A.IsStaff = 0;
	EXEC [COR].[SP_GetUser] @ID, @ID
COMMIT