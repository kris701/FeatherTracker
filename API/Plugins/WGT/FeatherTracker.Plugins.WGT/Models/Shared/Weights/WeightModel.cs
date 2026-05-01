using DatabaseSharp.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.WGT.Models.Shared.Weights
{
	public class WeightModel
	{
		[JsonPropertyName("id")]
		[Required]
		public Guid ID { get; set; }
		[Required]
		public int Grams { get; set; }
		[DatabaseSharp(ColumnName = "FK_BirdID")]
		[Required]
		public Guid BirdID { get; set; }
		[Required]
		public DateTime Timestamp { get; set; }
	}
}
