using DatabaseSharp;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Models.Shared.Users;

namespace FeatherTracker.Plugins.Core.DatabaseInterface.Users
{
	public class RegisterUserModel(IDBClient client) :
		BaseSerializableSingleDBModel<RegisterUserInput, UserModel>(client, "COR.SP_RegisterUser")
	{
	}
}
