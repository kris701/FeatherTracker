using Uni.API.Models;

namespace FeatherTracker.Plugins.WGT
{
	public class WGTPlugin : BaseUniAPIPlugin
	{
		public WGTPlugin() : base(
			new Guid("73fbc588-a637-49f3-9ece-8d578cd7cd8a"),
			"FeatherTracker Weight",
			new List<Guid>()
			{
				new Guid("1ae27478-9875-4a9e-8df0-ac0cc2448bd4")
			})
		{
		}
	}
}
