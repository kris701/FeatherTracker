using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights
{
	public class GetAllBirdWeightsInput : BaseExecIDModel
	{
		[Required]
		public Guid BirdID { get; set; }
		[Required]
		public DateTime From { get; set; }
		[Required]
		public DateTime To { get; set; }
	}
}
