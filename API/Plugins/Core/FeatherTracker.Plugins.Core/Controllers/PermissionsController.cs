using DatabaseSharp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Helpers;
using FeatherTracker.Plugins.Core.DatabaseInterface.Permissions;

namespace FeatherTracker.Plugins.Core.Controllers
{
	/// <summary>
	/// Controller endpoints for permissions
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class PermissionsController : ControllerBase
	{
		private readonly IDBClient _dbClient;

		public PermissionsController([FromKeyedServices(CorePlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_dbClient = dbClient;
		}

		/// <summary>
		/// Get all the permissions in the system
		/// </summary>
		/// <returns></returns>
		/// <exception cref="Exception"></exception>
		/// <response code="200">A list of all permissions and descriptions½.</response>
		[HttpGet(Endpoints.Core.Permissions.Get_AllPermissions)]
		[Authorize(Roles = PermissionsTable.Core_Permission_Read)]
		public async Task<IActionResult> Get_AllPermissions()
		{
			var inputModel = new EmptyModel();
			User.SetExecID(inputModel);
			var model = new GetAllPermissionsModel(_dbClient);
			return Ok(await model.ExecuteAsync(inputModel));
		}
	}
}
