using FeatherTracker.Plugins.Core.Models.Shared.Users;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.Core.Models.Shared.Authentication
{
	public class AuthenticationOutput
	{
		public UserModel User { get; set; }
		[JsonPropertyName("jwtToken")]
		public string JWTToken { get; set; }

		public AuthenticationOutput(UserModel user, string jWTToken)
		{
			User = user;
			JWTToken = jWTToken;
		}
	}
}
