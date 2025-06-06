CREATE TABLE [COR].[Users]
(
	[PK_ID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,

	[FirstName] NVARCHAR(MAX) NOT NULL,
	[LastName] NVARCHAR(MAX) NOT NULL,

	[Email] NVARCHAR(MAX) NOT NULL,
	
	[LoginName] NVARCHAR(50) UNIQUE NOT NULL,
	[LoginPassword] NVARCHAR(MAX),
	[IsActive] BIT NOT NULL,
	[IsStaff] BIT NOT NULL,

	[CreatedAt] DATETIME NOT NULL,
	[UpdatedAt] DATETIME NULL
)