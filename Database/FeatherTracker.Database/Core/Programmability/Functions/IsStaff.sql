﻿CREATE FUNCTION [COR].[IsStaff]
(
	@ExecID UNIQUEIDENTIFIER
)
RETURNS BIT 
BEGIN
	RETURN (SELECT IsStaff FROM [COR].[Users] WHERE PK_ID = @ExecID);
END
