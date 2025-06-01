CREATE PROCEDURE [COR].[SP_ResetPassword]
	@Email NVARCHAR(MAX),
	@TempPassword NVARCHAR(MAX)
AS
BEGIN TRANSACTION
	UPDATE [COR].[Users] SET
		LoginPassword = @TempPassword
			WHERE Email = @Email;
COMMIT