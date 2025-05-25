namespace FeatherTracker.Plugins.Core.Models.Internal.Authentication
{
	public class JWTSettings
	{
		public string Secret { get; set; }
		public int LifetimeMin { get; set; }

		public JWTSettings(string secret, int lifetimeS)
		{
			Secret = secret;
			LifetimeMin = lifetimeS;
		}
	}
}
