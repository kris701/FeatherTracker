CREATE PROCEDURE [WGT].[GetDateRanges]
@ID UNIQUEIDENTIFIER
AS
BEGIN
    SELECT COALESCE (MIN(Timestamp), '2000-01-01') AS Oldest
    FROM   [WGT].[BirdWeights]
    WHERE  FK_BirdID = @ID;
    
    SELECT COALESCE (MAX(Timestamp), '2000-01-01') AS Newest
    FROM   [WGT].[BirdWeights]
    WHERE  FK_BirdID = @ID;
END