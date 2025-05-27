CREATE PROCEDURE [COR].[SP_AddPermissionIfNotExist]
	@ID NVARCHAR(256),
	@Description NVARCHAR(MAX),
	@Name NVARCHAR(MAX),
	@IsStaff BIT
AS
BEGIN TRANSACTION
	IF ((SELECT COUNT(*) FROM [COR].[Permissions] WHERE PK_ID = @ID) = 0)
		BEGIN
			INSERT INTO [COR].[Permissions] VALUES (@ID, @Name, @Description, @IsStaff)
			INSERT INTO [COR].[UserPermissions] SELECT NEWID(), PK_ID, @ID FROM [COR].[Users] AS A WHERE A.IsStaff = 1;
		END
COMMIT