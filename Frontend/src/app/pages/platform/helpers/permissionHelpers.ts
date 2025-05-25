export class PermissionHelpers
{
    public static HasPermission(to : string) : boolean {
        if (localStorage.getItem("perms")?.includes(to))
            return true;
        return false;
    }
}