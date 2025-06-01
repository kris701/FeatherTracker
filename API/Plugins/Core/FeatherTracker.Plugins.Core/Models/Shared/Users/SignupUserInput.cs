using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Core.Models.Shared.Users
{
	public class SignupUserInput
	{
		[Required]
		public string FirstName { get; set; }
		[Required]
		public string LastName { get; set; }

		[Required]
		public string Email { get; set; }

		[Required]
		public string LoginName { get; set; }
		[Required]
		public string Password { get; set; }
		[Required]
		public string EmailToken { get; set; }
	}
}
