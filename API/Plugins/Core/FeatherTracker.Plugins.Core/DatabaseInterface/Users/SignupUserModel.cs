using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Shared.Users;

namespace FeatherTracker.Plugins.Core.DatabaseInterface.Authentication
{
	public class SignupUserModel(IDBClient client) :
		BaseDBModel<SignupUserInput, UserModel>(client)
	{
		public override async Task<UserModel> ExecuteAsync(SignupUserInput input)
		{
			input.Password = HashingHelpers.CreateMD5(input.Password);

			var result = await _client.ExecuteAsync("COR.SP_SignupUser", input);
			return result[0][0].Fill<UserModel>(result);
		}
	}
}
