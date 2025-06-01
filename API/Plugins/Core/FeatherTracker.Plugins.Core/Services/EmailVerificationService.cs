using FeatherTracker.Plugins.Core.Models.Internal.Authentication;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeatherTracker.Plugins.Core.Services
{
	public class EmailVerificationService : BackgroundService
	{
		private VerificationTokens _tokens;

		public EmailVerificationService(VerificationTokens tokens)
		{
			_tokens = tokens;
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (true)
			{
				var now = DateTime.UtcNow;
				var toRemove = new List<string>();
				foreach(var key in _tokens.Tokens.Keys)
					if (_tokens.Tokens[key].ExpiresAt >= now)
						toRemove.Add(key);
				foreach (var token in toRemove)
					_tokens.Tokens.Remove(token);

				await Task.Delay(10000);
			}
		}
	}
}
