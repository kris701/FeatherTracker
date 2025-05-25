CREATE PROCEDURE [COR].[SP_AddUser]
	@ExecID UNIQUEIDENTIFIER,
	@FirstName NVARCHAR(MAX),
	@LastName NVARCHAR(MAX),
	@LoginName NVARCHAR(100),
	@Password NVARCHAR(MAX),
	@Permissions [GLB].[StringListType] READONLY,
	@IsActive BIT,
	@IsStaff BIT
AS
BEGIN TRANSACTION
	DECLARE @ID UNIQUEIDENTIFIER = NEWID()
	INSERT INTO [COR].[Users] VALUES (@ID, @FirstName, @LastName, @LoginName, @Password, @IsActive, @IsStaff, GETUTCDATE(), NULL);
	INSERT INTO [COR].[UserPermissions] SELECT NEWID(), @ID, * FROM @Permissions;
	EXEC [COR].[SP_GetUser] @ExecID, @ID
COMMIT