using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.BugReports.Models.Shared;

namespace FeatherTracker.Plugins.BugReports.DatabaseInterface
{
	public class BugReportsInterface(IDBClient client) : BaseCRUDModel<AddBugReportInput, BugReportModel, EmptyModel, BugReportModel>(
		client,
		"BUR.SP_AddBugReport",
		"BUR.SP_UpdateBugReport",
		"BUR.SP_GetBugReport",
		"BUR.SP_GetAllBugReports",
		"BUR.SP_DeleteBugReport")
	{
	}
}
