using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Helpers;
using FeatherTracker.Plugins.Birds.DatabaseInterfaces.Birds;
using FeatherTracker.Plugins.Birds.Models.Shared.Birds;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace FeatherTracker.Plugins.Birds.Controllers
{
	/// <summary>
	/// Controller endpoints for birds
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class BirdsController : ControllerBase
	{
		private readonly BirdsInterface _interface;

		public BirdsController([FromKeyedServices(BirdsPlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_interface = new BirdsInterface(dbClient);
		}

		/// <summary>
		/// Add a new bird
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the newly created bird</response>
		[HttpPost(Endpoints.Birds.Post_AddBird)]
		[Authorize(Roles = PermissionsTable.Birds_Write)]
		public async Task<IActionResult> Post_AddBird([FromBody] AddBirdInput inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.addModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Update an existing bird.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the updated bird</response>
		[HttpPatch(Endpoints.Birds.Patch_UpdateBird)]
		[Authorize(Roles = PermissionsTable.Birds_Write)]
		public async Task<IActionResult> Patch_UpdateBird([FromBody] BirdModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.updateModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Get all birds
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns a list of existing birds in a simplified format</response>
		[HttpGet(Endpoints.Birds.Get_AllBirds)]
		[Authorize(Roles = PermissionsTable.Birds_Read)]
		public async Task<IActionResult> Get_AllBirds()
		{
			var inputModel = new EmptyModel();
			User.SetExecID(inputModel);
			return Ok(await _interface.getAllModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Get a single bird.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the requested bird</response>
		[HttpGet(Endpoints.Birds.Get_Bird)]
		[Authorize(Roles = PermissionsTable.Birds_Read)]
		public async Task<IActionResult> Get_Bird([FromQuery] GetModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.getModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Delete a bird
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Deletes the target bird</response>
		[HttpDelete(Endpoints.Birds.Delete_Bird)]
		[Authorize(Roles = PermissionsTable.Birds_Write)]
		public async Task<IActionResult> Delete_Bird([FromQuery] DeleteModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.deleteModel.ExecuteAsync(inputModel));
		}
	}
}
