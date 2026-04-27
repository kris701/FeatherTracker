CREATE PROCEDURE [WGT].[UpdateWeight]
@ID UNIQUEIDENTIFIER, @Grams INT, @BirdID UNIQUEIDENTIFIER, @Timestamp DATETIME
AS
BEGIN TRANSACTION;

UPDATE  [WGT].[BirdWeights]
    SET Grams     = @Grams,
        FK_BirdID = @BirdID,
        Timestamp = @Timestamp
WHERE   ID = @ID;

EXECUTE [WGT].[GetWeight] @ID;

COMMIT TRANSACTION;