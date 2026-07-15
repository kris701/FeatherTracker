using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.COR.DatabaseInterface;
using FeatherTracker.Plugins.COR.Models.Shared.Birds;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeatherTracker.Plugins.COR.Controllers
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

		public BirdsController(IDBClient dbClient)
		{
			_interface = new BirdsInterface(dbClient);
		}

		/// <summary>
		/// Add a new bird
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the newly created bird</response>
		[HttpPost(Endpoints.COR.Birds.Post_AddBird)]
		public async Task<ActionResult<BirdModel>> Post_AddBird([FromBody] AddBirdInput inputModel)
		{
			return Ok(await _interface.AddAsync(inputModel));
		}

		/// <summary>
		/// Update an existing bird.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the updated bird</response>
		[HttpPatch(Endpoints.COR.Birds.Patch_UpdateBird)]
		public async Task<ActionResult<BirdModel>> Patch_UpdateBird([FromBody] BirdModel inputModel)
		{
			return Ok(await _interface.UpdateAsync(inputModel));
		}

		/// <summary>
		/// Get all birds
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns a list of existing birds in a simplified format</response>
		[HttpGet(Endpoints.COR.Birds.Get_AllBirds)]
		public async Task<ActionResult<List<ListBirdModel>>> Get_AllBirds()
		{
			return Ok(await _interface.GetAllAsync(new EmptyModel()));
		}

		/// <summary>
		/// Get a single bird.
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the requested bird</response>
		[HttpGet(Endpoints.COR.Birds.Get_Bird)]
		public async Task<ActionResult<BirdModel>> Get_Bird([FromQuery] GetModel inputModel)
		{
			return Ok(await _interface.GetAsync(inputModel));
		}

		/// <summary>
		/// Delete a bird
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Deletes the target bird</response>
		[HttpDelete(Endpoints.COR.Birds.Delete_Bird)]
		public async Task<IActionResult> Delete_Bird([FromQuery] DeleteModel inputModel)
		{
			return Ok(await _interface.DeleteAsync(inputModel));
		}
	}
}
