using DatabaseSharp.Models;
using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights
{
	public class AddBirdWeightInput : BaseExecIDModel
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
