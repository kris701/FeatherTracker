using DatabaseSharp.Models;
using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights
{
	public class BirdWeightModel : BaseExecIDModel
	{
		[DatabaseSharp(ColumnName = "PK_ID")]
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
