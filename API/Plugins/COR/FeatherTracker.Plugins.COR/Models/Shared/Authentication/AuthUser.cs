using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.COR.Models.Shared.Authentication
{
	public class AuthUser
	{
		[Required]
		public string Username { get; set; }
		[Required]
		public string PasswordHash { get; set; }
	}
}
