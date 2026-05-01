using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.COR.Models.Shared.Birds
{
	public class AddBirdInput
	{
		[Required]
		public string Name { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public string Type { get; set; }
		[Required]
		public string Icon { get; set; }
		[Required]
		public DateTime BirthDate { get; set; }
	}
}
