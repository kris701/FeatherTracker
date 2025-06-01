CREATE PROCEDURE [BUR].[SP_AddBugReport]
	@ExecID UNIQUEIDENTIFIER,
	@Title NVARCHAR(MAX),
	@Description NVARCHAR(MAX)
AS
BEGIN TRANSACTION
	DECLARE @ID UNIQUEIDENTIFIER = NEWID();
	INSERT INTO [BUR].[BugReports] VALUES (
		@ID,
		@Title,
		@Description,
		0,
		@ExecID,
		GETUTCDATE(),
		NULL);
	EXEC [BUR].[SP_GetBugReport] @ExecID, @ID;

	DECLARE @Reference NVARCHAR(MAX) = CONCAT_WS(';', 'bugreports', 'reports', CONCAT('report=', @ID));
	DECLARE @Title2 NVARCHAR(MAX) = CONCAT('Bug report ', @Title, ' created');
	DECLARE @Message NVARCHAR(MAX) = CONCAT('A bug report with the title ', @Title, ' have been created by ', COR.GetPrettyUserName(@ExecID));
	EXEC [COR].[SP_CreateNotifications] 
		@ExecID, 
		@Title2, 
		@Message, 
		@Reference, 
		'bugreports.reports.created'
COMMIT