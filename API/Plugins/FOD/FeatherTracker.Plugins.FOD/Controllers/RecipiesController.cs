using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.FOD.DatabaseInterfaces;
using FeatherTracker.Plugins.FOD.Models.Shared.Recipies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeatherTracker.Plugins.FOD.Controllers
{
	/// <summary>
	/// Controller endpoints for Recipies
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class RecipiesController : ControllerBase
	{
		private readonly RecipiesInterface _interface;

		public RecipiesController(IDBClient dbClient)
		{
			_interface = new RecipiesInterface(dbClient);
		}

		/// <summary>
		/// Add a new Recipie
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the newly created Recipie</response>
		[HttpPost(Endpoints.FOD.Post_AddRecipie)]
		public async Task<IActionResult> Post_AddRecipie([FromBody] AddRecipieInput inputModel)
		{
			return Ok(await _interface.AddAsync(inputModel));
		}

		/// <summary>
		/// Update an existing Recipie.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the updated Recipie</response>
		[HttpPatch(Endpoints.FOD.Patch_UpdateRecipie)]
		public async Task<IActionResult> Patch_UpdateRecipie([FromBody] RecipieModel inputModel)
		{
			return Ok(await _interface.UpdateAsync(inputModel));
		}

		/// <summary>
		/// Get all Recipies
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns a list of existing Recipies in a simplified format</response>
		[HttpGet(Endpoints.FOD.Get_AllRecipies)]
		public async Task<IActionResult> Get_AllRecipies()
		{
			return Ok(await _interface.GetAllAsync(new EmptyModel()));
		}

		/// <summary>
		/// Get a single Recipie.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the requested Recipie</response>
		[HttpGet(Endpoints.FOD.Get_Recipie)]
		public async Task<IActionResult> Get_Recipie([FromQuery] GetModel inputModel)
		{
			return Ok(await _interface.GetAsync(inputModel));
		}

		/// <summary>
		/// Delete a Recipie
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Deletes the target Recipie</response>
		[HttpDelete(Endpoints.FOD.Delete_Recipie)]
		public async Task<IActionResult> Delete_Recipie([FromQuery] DeleteModel inputModel)
		{
			return Ok(await _interface.DeleteAsync(inputModel));
		}
	}
}
