using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.WGT.Models.Shared.Weights
{
	public class GetAllBirdWeightsInput
	{
		[Required]
		public Guid BirdID { get; set; }
		[Required]
		public DateTime From { get; set; }
		[Required]
		public DateTime To { get; set; }
	}
}
