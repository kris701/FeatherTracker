namespace FeatherTracker.Plugins.COR.Models.Internal
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
