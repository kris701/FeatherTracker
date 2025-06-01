using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeatherTracker.Plugins.Core.Models.Internal.Authentication
{
	public class VerificationTokens
	{
		public Dictionary<string, VerificationToken> Tokens { get; set; }

		public VerificationTokens()
		{
			Tokens = new Dictionary<string, VerificationToken>();
		}
	}
}
