using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Helpers;
using FeatherTracker.Plugins.Birds.DatabaseInterfaces.BirdWeights;
using FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

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
		private readonly IDBClient _dbClient;

		public BirdWeightController([FromKeyedServices(BirdsPlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_dbClient = dbClient;
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
		/// Get the min and max dates for a given bird
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns the min and max dates</response>
		[HttpGet(Endpoints.Birds.Weights.Get_GetDateRanges)]
		[Authorize(Roles = PermissionsTable.Birds_Weight_Read)]
		public async Task<IActionResult> Get_GetDateRanges([FromQuery] GetModel inputModel)
		{
			User.SetExecID(inputModel);
			var model = new GetDateRangesModel(_dbClient);
			return Ok(await model.ExecuteAsync(inputModel));
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

		/// <summary>
		/// Deletes a set of weight logs
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">If successful</response>
		[HttpPatch(Endpoints.Birds.Weights.Patch_PurgeBirdWeights)]
		[Authorize(Roles = PermissionsTable.Birds_Weight_Write)]
		public async Task<IActionResult> Patch_PurgeBirdWeights([FromBody] PurgeBirdWeightsInput inputModel)
		{
			User.SetExecID(inputModel);
			var model = new PurgeBirdWeightsModel(_dbClient);
			return Ok(await model.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Imports a CSV file with weights
		/// </summary>
		/// <returns></returns>
		/// <response code="200">If successful</response>
		[HttpPost(Endpoints.Birds.Weights.Post_ImportWeights)]
		[Authorize(Roles = PermissionsTable.Birds_Weight_Write)]
		public async Task<IActionResult> Post_ImportWeights([Required] IFormFile file, [FromQuery] Guid BirdID)
		{
			using (StreamReader str = new StreamReader(file.OpenReadStream()))
			{
				var text = str.ReadToEnd();
				text = text.Replace("\r\n","\n");
				var lines = text.Split('\n', StringSplitOptions.RemoveEmptyEntries);
				if (lines.Length > 0)
				{
					var timestampColumnIndex = 0;
					var gramsColumnIndex = 1;
					var lineOffset = 0;
					if (lines[0].ToUpper().Contains("TIMESTAMP"))
					{
						var split = lines[0].ToUpper().Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();
						timestampColumnIndex = split.IndexOf("TIMESTAMP");
						gramsColumnIndex = split.IndexOf("GRAMS");
						lineOffset++;
					}
					foreach (var line in lines.Skip(lineOffset))
					{
						var split = line.Split(',', StringSplitOptions.RemoveEmptyEntries);
						var timestamp = DateTime.Parse(split[timestampColumnIndex]);
						var grams = int.Parse(split[gramsColumnIndex]);
						await _interface.addModel.ExecuteAsync(new AddBirdWeightInput()
						{
							BirdID = BirdID,
							ExecID = User.GetExecID(),
							Grams = grams,
							Timestamp = timestamp
						});
					}
				}

				return Ok();
			}
		}
	}
}
