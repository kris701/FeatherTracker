CREATE PROCEDURE [BRD].[SP_AddBirdWeight]
	@ExecID UNIQUEIDENTIFIER,
	@Grams INT,
	@BirdID UNIQUEIDENTIFIER,
	@Timestamp DATETIME
AS
BEGIN TRANSACTION
	DECLARE @ID UNIQUEIDENTIFIER = NEWID()
	INSERT INTO [BRD].[BirdWeights] VALUES (@ID, @Grams, @BirdID, @Timestamp);
	EXEC [BRD].[SP_GetBirdWeight] @ExecID, @ID
COMMIT