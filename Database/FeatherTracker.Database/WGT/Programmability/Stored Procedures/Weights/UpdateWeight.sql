CREATE PROCEDURE [WGT].[UpdateWeight]
@ID UNIQUEIDENTIFIER, @Grams INT, @BirdID UNIQUEIDENTIFIER, @Timestamp DATETIME
AS
BEGIN TRANSACTION;

UPDATE  [WGT].[Weights]
    SET Grams     = @Grams,
        FK_BirdID = @BirdID,
        Timestamp = @Timestamp
WHERE   ID = @ID;

COMMIT TRANSACTION;