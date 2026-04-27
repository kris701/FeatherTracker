using DatabaseSharp;
using FeatherTracker.API.Tools;
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

		public BirdWeightController(IDBClient dbClient)
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
		[HttpPost(Endpoints.WGT.Post_AddWeight)]
		public async Task<IActionResult> Post_AddWeight([FromBody] AddWeightInput inputModel)
		{
			return Ok(await _interface.AddAsync(inputModel));
		}

		/// <summary>
		/// Update an existing bird weights.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the updated bird weights</response>
		[HttpPatch(Endpoints.WGT.Patch_UpdateWeight)]
		public async Task<IActionResult> Patch_UpdateWeight([FromBody] WeightModel inputModel)
		{
			return Ok(await _interface.UpdateAsync(inputModel));
		}

		/// <summary>
		/// Get all weights for a bird
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns a list of weights for a given bird</response>
		[HttpGet(Endpoints.WGT.Get_AllWeights)]
		public async Task<IActionResult> Get_AllWeights([FromQuery] GetAllBirdWeightsInput inputModel)
		{
			return Ok(await _interface.GetAllAsync(inputModel));
		}

		/// <summary>
		/// Get the min and max dates for a given bird
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns the min and max dates</response>
		[HttpGet(Endpoints.WGT.Get_GetDateRanges)]
		public async Task<IActionResult> Get_GetDateRanges([FromQuery] GetModel inputModel)
		{
			var model = new GetDateRangesModel(_dbClient);
			return Ok(await model.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Delete a bird weight
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Deletes the target bird weight</response>
		[HttpDelete(Endpoints.WGT.Delete_Weight)]
		public async Task<IActionResult> Delete_Weight([FromQuery] DeleteModel inputModel)
		{
			return Ok(await _interface.DeleteAsync(inputModel));
		}

		/// <summary>
		/// Imports a CSV file with weights
		/// </summary>
		/// <returns></returns>
		/// <response code="200">If successful</response>
		[HttpPost(Endpoints.WGT.Post_ImportWeights)]
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
						await _interface.AddAsync(new AddWeightInput()
						{
							BirdID = BirdID,
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
