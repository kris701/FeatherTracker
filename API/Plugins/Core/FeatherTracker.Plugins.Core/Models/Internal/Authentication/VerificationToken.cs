using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeatherTracker.Plugins.Core.Models.Internal.Authentication
{
	public class VerificationToken
	{
		private static Random _random = new Random();

		public string Token { get; set; }
		public DateTime ExpiresAt { get; set; }

		public VerificationToken()
		{
			Token = RandomString(6);
			ExpiresAt = DateTime.UtcNow.AddMinutes(30);
		}

		private static string RandomString(int length)
		{
			const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			return new string(Enumerable.Repeat(chars, length)
				.Select(s => s[_random.Next(s.Length)]).ToArray());
		}
	}
}
