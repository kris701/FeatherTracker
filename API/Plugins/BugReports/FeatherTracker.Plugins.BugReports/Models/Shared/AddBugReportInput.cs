using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.BugReports.Models.Shared
{
	public class AddBugReportInput : BaseExecIDModel
	{
		[Required]
		public string Title { get; set; }
		[Required]
		public string Description { get; set; }
	}
}
