using DatabaseSharp.Models;
using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.Birds.Models.Shared.Birds
{
	public class BirdModel : BaseExecIDModel
	{
		[DatabaseSharp(ColumnName = "PK_ID")]
		[JsonPropertyName("id")]
		[Required]
		public Guid ID { get; set; }
		[Required]
		public string Name { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public string Type { get; set; }
		[Required]
		public string Icon { get; set; }
		[DatabaseSharp(ColumnName = "FK_UserID")]
		[Required]
		public Guid UserID { get; set; }

		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime CreatedAt { get; set; }
		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime? UpdatedAt { get; set; }
	}
}
