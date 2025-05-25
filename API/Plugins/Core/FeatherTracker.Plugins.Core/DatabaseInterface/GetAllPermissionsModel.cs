using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;

namespace FeatherTracker.Plugins.Core.DatabaseInterface
{
	public class GetAllPermissionsModel(IDBClient client) :
		BaseSerializableListDBModel<EmptyModel, PermissionModel>(client, "COR.SP_GetAllPermissions")
	{
	}
}
