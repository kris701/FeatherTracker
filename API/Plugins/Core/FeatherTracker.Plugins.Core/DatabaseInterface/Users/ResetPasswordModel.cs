using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Shared.Users;

namespace FeatherTracker.Plugins.Core.DatabaseInterface.Authentication
{
	public class ResetPasswordModel(IDBClient client) :
		BaseSerializableSingleDBModel<ResetPasswordInput, EmptyModel>(client, "COR.SP_ResetPassword")
	{
	}
}
