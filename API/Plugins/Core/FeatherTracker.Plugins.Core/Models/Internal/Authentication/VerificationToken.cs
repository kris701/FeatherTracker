using FeatherTracker.Plugins.Core.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeatherTracker.Plugins.Core.Models.Internal.Authentication
{
	public class VerificationToken
	{
		public string Token { get; set; }
		public DateTime ExpiresAt { get; set; }

		public VerificationToken()
		{
			Token = RandomHelpers.RandomString(6);
			ExpiresAt = DateTime.UtcNow.AddMinutes(30);
		}
	}
}
