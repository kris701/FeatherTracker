using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using FeatherTracker.Plugins.Core.Models.Shared.Users;
using System.Text;

namespace FeatherTracker.Plugins.Core.Helpers
{
	public static class JWTTokenHelpers
	{
		public static string CreateToken(UserModel model, string secret, int lifetimeMin)
		{
			var tokenHandler = new JsonWebTokenHandler();
			tokenHandler.SetDefaultTimesOnTokenCreation = false;
			var key = Encoding.ASCII.GetBytes(secret);

			var claims = new Dictionary<string, object>()
			{
				["nameid"] = model.ID.ToString(),
				["role"] = model.Permissions,
				["isstaff"] = model.IsStaff.ToString()
			};

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Claims = claims,
				Expires = DateTime.UtcNow.AddMinutes(lifetimeMin),
				IssuedAt = DateTime.UtcNow,
				NotBefore = DateTime.UtcNow,
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};
			var token = tokenHandler.CreateToken(tokenDescriptor);
			return token;
		}
	}
}
