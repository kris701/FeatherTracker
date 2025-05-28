CREATE PROCEDURE [BRD].[SP_UpdateBird]
	@ExecID UNIQUEIDENTIFIER,
	@ID UNIQUEIDENTIFIER,
	@Name NVARCHAR(MAX),
	@Description NVARCHAR(MAX),
	@Type NVARCHAR(MAX),
	@Icon NVARCHAR(MAX),
	@BirthDate DATETIME,
	@UserID UNIQUEIDENTIFIER
AS
BEGIN TRANSACTION
	UPDATE [BRD].[Birds] SET
		Name = @Name,
		Description = @Description,
		Type = @Type,
		Icon = @Icon,
		UpdatedAt = GETUTCDATE(),
		FK_UserID = @UserID,
		BirthDate = @BirthDate
			WHERE PK_ID = @ID
	EXEC [BRD].[SP_GetBird] @ExecID, @ID
COMMIT