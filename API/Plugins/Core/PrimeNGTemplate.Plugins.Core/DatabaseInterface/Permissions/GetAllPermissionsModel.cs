using DatabaseSharp;
using PrimeNGTemplate.API.Tools;
using PrimeNGTemplate.API.Tools.Serialization;
using PrimeNGTemplate.Plugins.Core.Models.Shared.Authentication;

namespace PrimeNGTemplate.Plugins.Core.DatabaseInterface.Permissions
{
	public class GetAllPermissionsModel(IDBClient client) :
		BaseSerializableListDBModel<EmptyModel, PermissionModel>(client, "COR.SP_GetAllPermissions")
	{
	}
}
