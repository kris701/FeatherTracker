using DatabaseSharp;
using PrimeNGTemplate.API.Tools;
using PrimeNGTemplate.Plugins.Core.Models.Shared.Users;

namespace PrimeNGTemplate.Plugins.Core.DatabaseInterface.Users
{
	public class UsersInterface(IDBClient client) : BaseCRUDModel<AddUserInput, UserModel, EmptyModel, ListUserModel>(
		client,
		"COR.SP_AddUser",
		"COR.SP_UpdateUser",
		"COR.SP_GetUser",
		"COR.SP_GetAllUsers",
		"COR.SP_DeleteUser")
	{
	}
}
