CREATE PROCEDURE [COR].[SP_UpdatePassword]
	@ExecID UNIQUEIDENTIFIER,
	@OldPassword NVARCHAR(MAX),
	@NewPassword NVARCHAR(MAX)
AS
BEGIN TRANSACTION
	IF ((SELECT COUNT(1) FROM [COR].[Users] WHERE PK_ID = @ExecID AND LoginPassword = @OldPassword) = 0)
		THROW 51000, 'Old password does not match the one in the database!', 1;
	UPDATE [COR].[Users] SET LoginPassword = @NewPassword WHERE PK_ID = @ExecID;
COMMIT