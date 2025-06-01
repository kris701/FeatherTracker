using DatabaseSharp.Models;
using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.BugReports.Models.Shared
{
	public class BugReportModel : BaseExecIDModel
	{
		[Required]
		[DatabaseSharp(ColumnName = "PK_ID")]
		[JsonPropertyName("id")]
		public Guid ID { get; set; }
		[Required]
		public string Title { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public bool IsResolved { get; set; }
		[Required]
		[DatabaseSharp(ColumnName = "FK_CreatedBy_ID")]
		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public Guid CreatedBy { get; set; }

		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime CreatedAt { get; set; }
		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime? UpdatedAt { get; set; }
	}
}
