CREATE PROCEDURE [BRD].[SP_GetAllBirdWeights]
	@ExecID UNIQUEIDENTIFIER,
	@BirdID UNIQUEIDENTIFIER,
	@From DATETIME,
	@To DATETIME
AS
BEGIN
	SELECT * FROM [BRD].[BirdWeights] WHERE 
		FK_BirdID = @BirdID AND 
		DATEADD(dd, 0, DATEDIFF(dd, 0, Timestamp)) >= DATEADD(dd, 0, DATEDIFF(dd, 0, @From)) AND 
		DATEADD(dd, 0, DATEDIFF(dd, 0, Timestamp)) <= DATEADD(dd, 0, DATEDIFF(dd, 0, @To))
			ORDER BY Timestamp ASC
END