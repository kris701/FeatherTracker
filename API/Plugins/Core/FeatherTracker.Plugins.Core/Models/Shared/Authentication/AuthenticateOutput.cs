using FeatherTracker.Plugins.Core.Models.Shared.Users;

namespace FeatherTracker.Plugins.Core.Models.Shared.Authentication
{
	public class AuthenticateOutput
	{
		public UserModel? User { get; set; }
		public string Token { get; set; }

		public AuthenticateOutput(UserModel? user, string token)
		{
			User = user;
			Token = token;
		}
	}
}
