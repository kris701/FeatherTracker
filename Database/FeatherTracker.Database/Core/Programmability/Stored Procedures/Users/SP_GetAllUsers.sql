CREATE PROCEDURE [COR].[SP_GetAllUsers]
	@ExecID UNIQUEIDENTIFIER
AS
BEGIN TRANSACTION
	SELECT
		A.PK_ID, 
		A.FirstName, 
		A.LastName, 
		(SELECT COUNT(*) FROM [COR].[UserPermissions] WHERE FK_User_ID = A.PK_ID) AS PermissionsCount,
		A.IsActive,
		A.CreatedAt,
		A.UpdatedAt
	FROM [COR].[Users] AS A
COMMIT