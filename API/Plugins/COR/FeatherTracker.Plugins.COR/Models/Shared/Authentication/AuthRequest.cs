using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.COR.Models.Shared.Authentication
{
	public class AuthRequest
	{
		[Required]
		public string Username { get; set; }
		[Required]
		public string Password { get; set; }
	}
}
