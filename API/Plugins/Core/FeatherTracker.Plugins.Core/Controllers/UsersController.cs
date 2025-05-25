using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Helpers;
using FeatherTracker.Plugins.Core.DatabaseInterface.Users;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Shared.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace FeatherTracker.Plugins.Core.Controllers
{
	/// <summary>
	/// Controller endpoints for users
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class UsersController : ControllerBase
	{
		private readonly UsersInterface _interface;

		public UsersController([FromKeyedServices(CorePlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_interface = new UsersInterface(dbClient);
		}

		/// <summary>
		/// Add a new user
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the newly created user</response>
		[HttpPost(Endpoints.Core.Users.Post_AddUser)]
		[Authorize(Roles = PermissionsTable.Core_Users_Write)]
		public async Task<IActionResult> Post_AddUser([FromBody] AddUserInput inputModel)
		{
			User.SetExecID(inputModel);
			inputModel.Password = HashingHelpers.CreateMD5(inputModel.Password);
			return Ok(await _interface.addModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Update an existing user.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the updated user</response>
		[HttpPatch(Endpoints.Core.Users.Patch_UpdateUser)]
		[Authorize(Roles = PermissionsTable.Core_Users_Write + "," + PermissionsTable.Core_Users_Own_EditProfile)]
		public async Task<IActionResult> Patch_UpdateUser([FromBody] UserModel inputModel)
		{
			User.SetExecID(inputModel);
			if (!User.HasPermission(PermissionsTable.Core_Users_Write) &&
				User.HasPermission(PermissionsTable.Core_Users_Own_EditProfile) &&
				User.GetExecID() != inputModel.ExecID)
				return Unauthorized("You can only modify your own user!");
			return Ok(await _interface.updateModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Get all users
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns a list of existing users in a simplified format</response>
		[HttpGet(Endpoints.Core.Users.Get_AllUsers)]
		[Authorize(Roles = PermissionsTable.Core_Users_Read)]
		public async Task<IActionResult> Get_AllUsers()
		{
			var inputModel = new EmptyModel();
			User.SetExecID(inputModel);
			return Ok(await _interface.getAllModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Get a single user.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the requested user</response>
		[HttpGet(Endpoints.Core.Users.Get_User)]
		[Authorize(Roles = PermissionsTable.Core_Users_Read + "," + PermissionsTable.Core_Users_Own_Read)]
		public async Task<IActionResult> Get_User([FromQuery] GetModel inputModel)
		{
			User.SetExecID(inputModel);
			if (!User.HasPermission(PermissionsTable.Core_Users_Read) && inputModel.ID != inputModel.ExecID)
				return Unauthorized("You can only get your own user!");
			return Ok(await _interface.getModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Delete a user
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Deletes the target user</response>
		[HttpDelete(Endpoints.Core.Users.Delete_User)]
		[Authorize(Roles = PermissionsTable.Core_Users_Write)]
		public async Task<IActionResult> Delete_User([FromQuery] DeleteModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.deleteModel.ExecuteAsync(inputModel));
		}
	}
}
