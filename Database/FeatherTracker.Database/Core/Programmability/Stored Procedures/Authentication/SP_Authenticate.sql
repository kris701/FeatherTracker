CREATE PROCEDURE [COR].[SP_Authenticate]
	@Username NVARCHAR(MAX),
	@Password NVARCHAR(MAX)
AS
BEGIN
	DECLARE @targetID UNIQUEIDENTIFIER = (SELECT TOP 1 PK_ID FROM [COR].[Users] WHERE LoginName = @Username AND LoginPassword = @Password)
	IF (@targetID = NULL)
		THROW 51000, 'Username or password is incorrect!', 1;

	SELECT * FROM [COR].[Users] WHERE PK_ID = @targetID;
	SELECT * FROM [COR].[UserPermissions] WHERE FK_User_ID = @targetID;
END