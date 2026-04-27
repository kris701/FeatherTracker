CREATE PROCEDURE [COR].[UpdateBird]
@ID UNIQUEIDENTIFIER, @Name NVARCHAR (MAX), @Description NVARCHAR (MAX), @Type NVARCHAR (MAX), @Icon NVARCHAR (MAX), @BirthDate DATETIME
AS
BEGIN TRANSACTION;

UPDATE  [COR].[Birds]
    SET Name        = @Name,
        Description = @Description,
        Type        = @Type,
        Icon        = @Icon,
        UpdatedAt   = GETUTCDATE(),
        BirthDate   = @BirthDate
WHERE   ID = @ID;

EXECUTE [COR].[GetBird] @ID;

COMMIT TRANSACTION;