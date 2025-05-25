using DatabaseSharp;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Internal.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Users;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace FeatherTracker.Plugins.Core.DatabaseInterface.Authentication
{
	public class AuthenticateModel(IDBClient client, JWTSettings settings) :
		BaseDBModel<AuthenticateInput, AuthenticationOutput>(client)
	{
		private readonly JWTSettings _settings = settings;

		public override async Task<AuthenticationOutput> ExecuteAsync(AuthenticateInput input)
		{
			input.Password = HashingHelpers.CreateMD5(input.Password);

			var result = await _client.ExecuteAsync("COR.SP_Authenticate", input);
			if (result[0].Count == 0)
				throw new Exception("Username or password is invalid!");

			var user = result[0][0].Fill<UserModel>(result);
			return new AuthenticationOutput(user, JWTTokenHelpers.CreateToken(user, _settings.Secret, _settings.LifetimeMin));
		}
	}
}
