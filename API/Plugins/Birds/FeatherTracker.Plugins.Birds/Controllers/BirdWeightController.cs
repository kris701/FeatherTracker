using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Helpers;
using FeatherTracker.Plugins.Birds.DatabaseInterfaces.BirdWeights;
using FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace FeatherTracker.Plugins.Birds.Controllers
{
	/// <summary>
	/// Controller endpoints for bird weights
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class BirdWeightController : ControllerBase
	{
		private readonly BirdWeightsInterface _interface;

		public BirdWeightController([FromKeyedServices(BirdsPlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_interface = new BirdWeightsInterface(dbClient);
		}

		/// <summary>
		/// Add a new bird weights
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the newly created bird weights</response>
		[HttpPost(Endpoints.Birds.Weights.Post_AddBirdWeight)]
		[Authorize(Roles = PermissionsTable.Birds_Weight_Write)]
		public async Task<IActionResult> Post_AddBirdWeight([FromBody] AddBirdWeightInput inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.addModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Update an existing bird weights.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the updated bird weights</response>
		[HttpPatch(Endpoints.Birds.Weights.Patch_UpdateBirdWeight)]
		[Authorize(Roles = PermissionsTable.Birds_Weight_Write)]
		public async Task<IActionResult> Patch_UpdateBirdWeight([FromBody] BirdWeightModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.updateModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Get all weights for a bird
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns a list of weights for a given bird</response>
		[HttpGet(Endpoints.Birds.Weights.Get_AllBirdWeights)]
		[Authorize(Roles = PermissionsTable.Birds_Weight_Read)]
		public async Task<IActionResult> Get_AllBirdWeights([FromQuery] GetAllBirdWeightsInput inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.getAllModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Get a single bird weight.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the requested bird weight</response>
		[HttpGet(Endpoints.Birds.Weights.Get_BirdWeight)]
		[Authorize(Roles = PermissionsTable.Birds_Weight_Read)]
		public async Task<IActionResult> Get_BirdWeight([FromQuery] GetModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.getModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Delete a bird weight
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Deletes the target bird weight</response>
		[HttpDelete(Endpoints.Birds.Weights.Delete_BirdWeight)]
		[Authorize(Roles = PermissionsTable.Birds_Weight_Write)]
		public async Task<IActionResult> Delete_BirdWeight([FromQuery] DeleteModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _interface.deleteModel.ExecuteAsync(inputModel));
		}
	}
}
