CREATE PROCEDURE [BUR].[SP_DeleteBugReport]
	@ExecID UNIQUEIDENTIFIER,
	@ID UNIQUEIDENTIFIER
AS
BEGIN TRANSACTION
	DELETE FROM [BUR].[BugReports] WHERE PK_ID = @ID;

	DECLARE @Title2 NVARCHAR(MAX) = CONCAT('Bug report ', @ID, ' deleted');
	DECLARE @Message NVARCHAR(MAX) = CONCAT('An bug report with the ID ', @ID, ' have been deleted by ', COR.GetPrettyUserName(@ExecID));
	EXEC [COR].[SP_CreateNotifications] 
		@ExecID, 
		@Title2, 
		@Message, 
		'', 
		'bugreports.reports.deleted'
COMMIT