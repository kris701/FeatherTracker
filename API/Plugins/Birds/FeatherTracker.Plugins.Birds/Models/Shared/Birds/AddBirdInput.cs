using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Birds.Models.Shared.Birds
{
	public class AddBirdInput : BaseExecIDModel
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
		public Guid UserID { get; set; }
		[Required]
		public DateTime BirthDate { get; set; }
	}
}
