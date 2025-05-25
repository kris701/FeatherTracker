using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Core.Models.Shared.Users
{
	public class RegisterUserInput
	{
		[Required]
		public string FirstName { get; set; }
		[Required]
		public string LastName { get; set; }

		[Required]
		public string LoginName { get; set; }
		[Required]
		public string Password { get; set; }
	}
}
