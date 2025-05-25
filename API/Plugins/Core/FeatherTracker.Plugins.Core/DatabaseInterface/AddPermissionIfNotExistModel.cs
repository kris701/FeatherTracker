using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;

namespace FeatherTracker.Plugins.Core.DatabaseInterface
{
	public class AddPermissionIfNotExistModel(IDBClient client) :
		BaseSerializableSingleDBModel<PermissionModel, EmptyModel>(client, "COR.SP_AddPermissionIfNotExist")
	{
	}
}
