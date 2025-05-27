CREATE PROCEDURE [COR].[SP_GetAllPermissions]
	@ExecID UNIQUEIDENTIFIER
AS
BEGIN
	IF([COR].[IsStaff](@ExecID) = 1)
		SELECT * FROM [COR].[Permissions]
	ELSE
		SELECT * FROM [COR].[Permissions] WHERE IsStaff = 0
END