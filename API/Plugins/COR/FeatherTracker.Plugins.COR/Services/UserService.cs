using FeatherTracker.Plugins.COR.Models.Internal;
using FeatherTracker.Plugins.COR.Models.Shared.Authentication;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using ToolsSharp;

namespace FeatherTracker.Plugins.COR.Services
{
	public class UserService
	{
		private static readonly string _authFile = ".secrets/auth.json";

		private readonly JWTSettings _settings;

		public UserService(JWTSettings settings)
		{
			_settings = settings;
		}

		public bool UserExists() => File.Exists(_authFile);

		public AuthResponse Authenticate(AuthRequest req)
		{
			if (!File.Exists(_authFile))
				throw new Exception("You must create the admin user first!");

			var user = JsonSerializer.Deserialize<AuthUser>(File.ReadAllText(_authFile));
			if (user == null)
				throw new Exception("Could not read auth file!");
			if (user.Username != req.Username)
				throw new Exception("Invalid username or password!");
			if (!HashingHelpers.VerifyHash(user.PasswordHash, req.Password, System.Security.Cryptography.HashAlgorithmName.SHA1))
				throw new Exception("Invalid username or password!");

			return new AuthResponse(
				req.Username,
				CreateToken(req.Username, _settings.Secret, _settings.LifetimeMin));
		}

		public AuthResponse CreateAdminUser(AuthRequest req)
		{
			if (File.Exists(_authFile))
				throw new Exception("Admin user already exists!");

			var authUser = new AuthUser()
			{
				Username = req.Username,
				PasswordHash = HashingHelpers.HashString(req.Password, System.Security.Cryptography.HashAlgorithmName.SHA1)
			};
			File.WriteAllText(_authFile, JsonSerializer.Serialize(authUser));
			return new AuthResponse(
				req.Username,
				CreateToken(req.Username, _settings.Secret, _settings.LifetimeMin));
		}

		private static string CreateToken(string username, string secret, double lifetimeMin)
		{
			var tokenHandler = new JsonWebTokenHandler();
			tokenHandler.SetDefaultTimesOnTokenCreation = false;
			var key = Encoding.ASCII.GetBytes(secret);

			var claims = new Dictionary<string, object>()
			{
				["nameid"] = username
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
