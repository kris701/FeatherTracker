using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.WGT.Models.Shared.Weights
{
	public class DeleteRangeModel
	{
		[Required]
		public List<Guid> IDs { get; set; }
	}
}
