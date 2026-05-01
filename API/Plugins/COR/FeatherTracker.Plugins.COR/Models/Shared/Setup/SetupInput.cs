using FeatherTracker.Plugins.COR.Models.Shared.Authentication;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.COR.Models.Shared.Setup
{
	public class SetupInput
	{
		[Required]
		public AuthRequest User { get; set; }
	}
}
