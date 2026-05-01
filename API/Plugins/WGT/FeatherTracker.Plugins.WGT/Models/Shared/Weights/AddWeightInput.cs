using DatabaseSharp.Attributes;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.WGT.Models.Shared.Weights
{
	public class AddWeightInput
	{
		[Required]
		public int Grams { get; set; }
		[DatabaseSharp(ColumnName = "FK_BirdID")]
		[Required]
		public Guid BirdID { get; set; }
		[Required]
		public DateTime Timestamp { get; set; }
	}
}
