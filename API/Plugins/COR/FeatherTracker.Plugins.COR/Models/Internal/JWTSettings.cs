namespace FeatherTracker.Plugins.COR.Models.Internal
{
	public class JWTSettings
	{
		public int LifetimeMin { get; set; }
		public string APIURL { get; set; }

		public JWTSettings(int lifetimeS, string apiURL)
		{
			LifetimeMin = lifetimeS;
			APIURL = apiURL;
		}
	}
}
