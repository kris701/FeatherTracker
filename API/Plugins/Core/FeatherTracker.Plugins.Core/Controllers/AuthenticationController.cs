using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Helpers;
using FeatherTracker.Plugins.Core.DatabaseInterface;
using FeatherTracker.Plugins.Core.DatabaseInterface.Authentication;
using FeatherTracker.Plugins.Core.Models.Internal.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace FeatherTracker.Plugins.Core.Controllers
{
	/// <summary>
	/// Controller endpoints for authentication
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class AuthenticationController : ControllerBase
	{
		private readonly IDBClient _dbClient;
		private readonly JWTSettings _settings;

		public AuthenticationController([FromKeyedServices(CorePlugin.DBClientKeyName)] IDBClient dbClient, JWTSettings settings)
		{
			_dbClient = dbClient;
			_settings = settings;
		}

		/// <summary>
		/// Authenticate using a username and password
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">If login was successful.</response>
		[AllowAnonymous]
		[HttpPost(Endpoints.Core.Authentication.Post_Authenticate)]
		public async Task<IActionResult> Post_Authenticate([FromBody] AuthenticateInput inputModel)
		{
			var model = new AuthenticateModel(_dbClient, _settings);
			return Ok(await model.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Impersonate a given user
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Resulting JWT token for the user.</response>
		[HttpPost(Endpoints.Core.Authentication.Post_Impersonate)]
		[Authorize(Roles = PermissionsTable.Core_User_Impersonate)]
		public async Task<IActionResult> Post_Impersonate([FromBody] ImpersonateInput inputModel)
		{
			User.SetExecID(inputModel);
			var model = new ImpersonateModel(_dbClient, _settings);
			return Ok(await model.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Change your password
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <exception cref="Exception"></exception>
		/// <response code="200">If password change was successful.</response>
		[HttpPost(Endpoints.Core.Authentication.Post_UpdatePassword)]
		[Authorize(Roles = PermissionsTable.Core_User_ChangePassword)]
		public async Task<IActionResult> Post_UpdatePassword([FromBody] UpdatePasswordInput inputModel)
		{
			User.SetExecID(inputModel);
			var model = new UpdatePasswordModel(_dbClient);
			return Ok(await model.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Get all the permissions in the system
		/// </summary>
		/// <returns></returns>
		/// <exception cref="Exception"></exception>
		/// <response code="200">A list of all permissions and descriptions½.</response>
		[HttpPost(Endpoints.Core.Authentication.Get_AllPermissions)]
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
