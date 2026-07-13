using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace FeatherTracker.Plugins.COR.Services
{
	public class JWTSigningKeyService
	{
		private SecurityKey _signingKey;
		private DateTime _expires = DateTime.MinValue;

		private bool _isUpdating = false;

		public List<SecurityKey> GetKeys(string token, SecurityToken securityToken, string kid, TokenValidationParameters validationParameters)
		{
			if (DateTime.UtcNow > _expires)
				GenerateNewKey();
			return new List<SecurityKey>() { _signingKey };
		}

		public SecurityKey GetKey()
		{
			if (DateTime.UtcNow > _expires)
				GenerateNewKey();
			return _signingKey;
		}

		private void GenerateNewKey()
		{
			if (_isUpdating)
				return;
			_isUpdating = true;

			var algo = Aes.Create();
			var maxKeySize = algo.LegalKeySizes[algo.LegalKeySizes.Length - 1].MaxSize;
			var maxBlockSize = algo.LegalBlockSizes[algo.LegalBlockSizes.Length - 1].MaxSize;
			algo.KeySize = maxKeySize;
			algo.BlockSize = maxBlockSize;
			algo.GenerateIV();
			algo.GenerateKey();
			_signingKey = new SymmetricSecurityKey(algo.Key);
			_expires = DateTime.UtcNow.AddDays(1).Date;

			_isUpdating = false;
		}
	}
}
