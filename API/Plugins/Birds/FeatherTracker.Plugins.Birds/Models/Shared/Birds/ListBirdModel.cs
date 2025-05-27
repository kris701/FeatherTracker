using DatabaseSharp.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.Birds.Models.Shared.Birds
{
	public class ListBirdModel
	{
		[DatabaseSharp(ColumnName = "PK_ID")]
		[JsonPropertyName("id")]
		public Guid ID { get; set; }
		public string Name { get; set; }
		[Required]
		public string Type { get; set; }
		[Required]
		public string Icon { get; set; }
	}
}
