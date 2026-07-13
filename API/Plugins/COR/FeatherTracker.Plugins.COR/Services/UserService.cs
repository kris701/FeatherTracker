using FeatherTracker.Plugins.COR.Models.Internal;
using FeatherTracker.Plugins.COR.Models.Shared.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;

namespace FeatherTracker.Plugins.COR.Services
{
	public class UserService
	{
		private static readonly string _authPath = ".secrets";
		private static readonly string _authFile = "auth.json";

		private readonly JWTSettings _settings;
		private readonly JWTSigningKeyService _keyService;

		public UserService(JWTSettings settings, JWTSigningKeyService keyService)
		{
			_settings = settings;
			if (!Directory.Exists(_authPath))
				Directory.CreateDirectory(_authPath);
			_keyService = keyService;
		}

		public bool UserExists() => File.Exists(Path.Combine(_authPath, _authFile));

		public AuthResponse Authenticate(AuthRequest req)
		{
			if (!File.Exists(Path.Combine(_authPath, _authFile)))
				throw new Exception("You must create the admin user first!");

			var user = JsonSerializer.Deserialize<AuthUser>(File.ReadAllText(Path.Combine(_authPath, _authFile)));
			if (user == null)
				throw new Exception("Could not read auth file!");
			if (user.Username != req.Username)
				throw new Exception("Invalid username or password!");
			var hasher = new PasswordHasher<AuthUser>();
			if (hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password) != PasswordVerificationResult.Success)
				throw new Exception("Invalid username or password!");

			return new AuthResponse(
				req.Username,
				CreateToken(req.Username, DateTime.UtcNow, _settings, _keyService));
		}

		public AuthResponse CreateAdminUser(AuthRequest req)
		{
			if (File.Exists(Path.Combine(_authPath, _authFile)))
				throw new Exception("Admin user already exists!");

			var authUser = new AuthUser()
			{
				Username = req.Username
			};
			var hasher = new PasswordHasher<AuthUser>();
			authUser.PasswordHash = hasher.HashPassword(authUser, req.Password);
			File.WriteAllText(Path.Combine(_authPath, _authFile), JsonSerializer.Serialize(authUser));
			return new AuthResponse(
				req.Username,
				CreateToken(req.Username, DateTime.UtcNow, _settings, _keyService));
		}

		private static string CreateToken(string username, DateTime issued, JWTSettings settings, JWTSigningKeyService signingService)
		{
			var tokenHandler = new JsonWebTokenHandler();
			tokenHandler.SetDefaultTimesOnTokenCreation = false;

			var claims = new Dictionary<string, object>()
			{
				["nameid"] = username
			};

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Claims = claims,
				Expires = issued.AddMinutes(settings.LifetimeMin),
				Issuer = settings.APIURL,
				IssuedAt = issued,
				Audience = settings.APIURL,
				NotBefore = issued,
				SigningCredentials = new SigningCredentials(signingService.GetKey(), SecurityAlgorithms.HmacSha256Signature)
			};
			var token = tokenHandler.CreateToken(tokenDescriptor);
			return token;
		}
	}
}
