CREATE PROCEDURE [COR].[SP_GetAllUsers]
	@ExecID UNIQUEIDENTIFIER
AS
BEGIN TRANSACTION
	SELECT
		A.PK_ID, 
		A.FirstName, 
		A.LastName, 
		A.LoginName, 
		A.Email, 
		A.IsActive,
		A.IsStaff,
		A.CreatedAt,
		A.UpdatedAt
	FROM [COR].[Users] AS A
COMMIT