using DatabaseSharp;
using PrimeNGTemplate.API.Tools;
using PrimeNGTemplate.API.Tools.Serialization;
using PrimeNGTemplate.Plugins.Core.Helpers;
using PrimeNGTemplate.Plugins.Core.Models.Shared.Authentication;

namespace PrimeNGTemplate.Plugins.Core.DatabaseInterface.Authentication
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
