using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Internal.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Users;

namespace FeatherTracker.Plugins.Core.DatabaseInterface.Authentication
{
	public class SignupUserModel(IDBClient client, VerificationTokens tokens) :
		BaseDBModel<SignupUserInput, UserModel>(client)
	{
		private readonly VerificationTokens _tokens = tokens;

		public override async Task<UserModel> ExecuteAsync(SignupUserInput input)
		{
			if (!_tokens.Tokens.ContainsKey(input.LoginName))
				throw new Exception("Unknown login name!");
			var target = _tokens.Tokens[input.LoginName];
			if (target.Token != input.EmailToken)
				throw new Exception("The email verification token is invalid!");

			input.Password = HashingHelpers.CreateMD5(input.Password);

			var result = await _client.ExecuteAsync("COR.SP_SignupUser", input);
			_tokens.Tokens.Remove(input.LoginName);
			return result[0][0].Fill<UserModel>(result);
		}
	}
}
