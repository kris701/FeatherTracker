using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Core.Models.Shared.Users
{
	public class UserModel
	{
		[Required]
		public string FirstName { get; set; }
		[Required]
		public string LastName { get; set; }

		public string? Password { get; set; }

		[Required]
		public string LoginName { get; set; }
	}
}
