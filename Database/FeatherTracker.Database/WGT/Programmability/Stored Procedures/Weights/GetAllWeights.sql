CREATE PROCEDURE [WGT].[GetAllWeights]
@BirdID UNIQUEIDENTIFIER, @From DATETIME, @To DATETIME
AS
BEGIN
    SELECT   *
    FROM     [WGT].[Weights]
    WHERE    FK_BirdID = @BirdID
             AND DATEADD(dd, 0, DATEDIFF(dd, 0, Timestamp)) >= DATEADD(dd, 0, DATEDIFF(dd, 0, @From))
             AND DATEADD(dd, 0, DATEDIFF(dd, 0, Timestamp)) <= DATEADD(dd, 0, DATEDIFF(dd, 0, @To))
    ORDER BY Timestamp ASC;
END