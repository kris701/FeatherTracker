CREATE PROCEDURE [BRD].[SP_UpdateBirdWeight]
	@ExecID UNIQUEIDENTIFIER,
	@ID UNIQUEIDENTIFIER,
	@Grams INT,
	@BirdID UNIQUEIDENTIFIER,
	@Timestamp DATETIME
AS
BEGIN TRANSACTION
	UPDATE [BRD].[BirdWeights] SET
		Grams = @Grams,
		FK_BirdID = @BirdID,
		Timestamp = @Timestamp
			WHERE PK_ID = @ID
	EXEC [BRD].[SP_GetBirdWeight] @ExecID, @ID
COMMIT