CREATE PROCEDURE [BUR].[SP_UpdateBugReport]
	@ExecID UNIQUEIDENTIFIER,
	@ID UNIQUEIDENTIFIER,
	@Title NVARCHAR(MAX),
	@Description NVARCHAR(MAX),
	@IsResolved BIT
AS
BEGIN TRANSACTION
	UPDATE [BUR].[BugReports] SET 
		Title = @Title, 
		Description = @Description,
		IsResolved = @IsResolved,
		UpdatedAt = GETUTCDATE()
			WHERE PK_ID = @ID
	EXEC [BUR].[SP_GetBugReport] @ExecID, @ID
COMMIT