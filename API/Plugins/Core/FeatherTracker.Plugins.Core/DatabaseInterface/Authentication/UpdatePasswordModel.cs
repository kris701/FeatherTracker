using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;

namespace FeatherTracker.Plugins.Core.DatabaseInterface.Authentication
{
	public class UpdatePasswordModel(IDBClient client) :
		BaseDBModel<UpdatePasswordInput, EmptyModel>(client)
	{
		public override async Task<EmptyModel> ExecuteAsync(UpdatePasswordInput input)
		{
			input.OldPassword = HashingHelpers.CreateMD5(input.OldPassword);
			input.NewPassword = HashingHelpers.CreateMD5(input.NewPassword);

			var result = await _client.ExecuteAsync("COR.SP_UpdatePassword", input);
			return new EmptyModel();
		}
	}
}
