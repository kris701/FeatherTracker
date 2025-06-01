using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Helpers;
using FeatherTracker.Plugins.BugReports.DatabaseInterface;
using FeatherTracker.Plugins.BugReports.Models.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace FeatherTracker.Plugins.BugReports.Controllers
{
	/// <summary>
	/// Controller endpoints for bug reports
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class BugReportsController : ControllerBase
	{
		private readonly BugReportsInterface _model;

		public BugReportsController([FromKeyedServices(BugReportsPlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_model = new BugReportsInterface(dbClient);
		}

		/// <summary>
		/// Add a new bug report
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the newly created bug report.</response>
		[HttpPost(Endpoints.BugReports.Post_AddReport)]
		[Authorize(Roles = PermissionsTable.BugReports_Reports_Write)]
		public async Task<IActionResult> Post_AddReport([FromBody] AddBugReportInput inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _model.addModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Updates an existing bug report
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the updated bug report.</response>
		[HttpPatch(Endpoints.BugReports.Patch_UpdateReport)]
		[Authorize(Roles = PermissionsTable.BugReports_Reports_Write)]
		public async Task<IActionResult> Patch_UpdateReport([FromBody] BugReportModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _model.updateModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Gets all the bug reports in the system
		/// </summary>
		/// <returns></returns>
		/// <response code="200">Returns a list of all the categories in the system.</response>
		[HttpGet(Endpoints.BugReports.Get_AllReports)]
		[Authorize(Roles = PermissionsTable.BugReports_Reports_Read)]
		public async Task<IActionResult> Get_AllReports()
		{
			var inputModel = new EmptyModel();
			User.SetExecID(inputModel);
			return Ok(await _model.getAllModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Get a specific bug report
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">Returns the requested bug report.</response>
		[HttpGet(Endpoints.BugReports.Get_Report)]
		[Authorize(Roles = PermissionsTable.BugReports_Reports_Read)]
		public async Task<IActionResult> Get_Report([FromQuery] GetModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _model.getModel.ExecuteAsync(inputModel));
		}

		/// <summary>
		/// Delete a bug report from the system
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">If the bug report was deleted successfully.</response>
		[HttpDelete(Endpoints.BugReports.Delete_Report)]
		[Authorize(Roles = PermissionsTable.BugReports_Reports_Write)]
		public async Task<IActionResult> Delete_Report([FromQuery] DeleteModel inputModel)
		{
			User.SetExecID(inputModel);
			return Ok(await _model.deleteModel.ExecuteAsync(inputModel));
		}
	}
}
