using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Internal.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Users;
using Microsoft.VisualBasic;
using System.Runtime;
using static Endpoints.Core;

namespace FeatherTracker.Plugins.Core.DatabaseInterface.Authentication
{
	public class RegisterUserModel(IDBClient client, JWTSettings settings) :
		BaseDBModel<RegisterUserInput, AuthenticationOutput>(client)
	{
		private readonly JWTSettings _settings = settings;

		public override async Task<AuthenticationOutput> ExecuteAsync(RegisterUserInput input)
		{
			input.Password = HashingHelpers.CreateMD5(input.Password);

			var result = await _client.ExecuteAsync("COR.SP_RegisterUser", input);

			var user = result[0][0].Fill<UserModel>(result);
			return new AuthenticationOutput(user, JWTTokenHelpers.CreateToken(user, _settings.Secret, _settings.LifetimeMin));
		}
	}
}
