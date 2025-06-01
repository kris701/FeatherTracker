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

	DECLARE @Reference NVARCHAR(MAX) = CONCAT_WS(';', 'bugreports', 'reports', CONCAT('report=', @ID));
	DECLARE @Title2 NVARCHAR(MAX) = CONCAT('Bug report ', @Title, ' updated');
	DECLARE @Message NVARCHAR(MAX) = CONCAT('An bug report with the title ', @Title, ' have been updated by ', COR.GetPrettyUserName(@ExecID));
	EXEC [COR].[SP_CreateNotifications] 
		@ExecID, 
		@Title2, 
		@Message, 
		@Reference, 
		'bugreports.reports.updated'
COMMIT