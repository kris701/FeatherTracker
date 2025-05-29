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
		public string Type { get; set; }
		public string Icon { get; set; }
		public DateTime BirthDate { get; set; }
		public DateTime? UpdatedAt { get; set; }
	}
}
