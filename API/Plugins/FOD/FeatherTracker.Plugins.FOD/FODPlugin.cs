using Uni.API.Models;

namespace FeatherTracker.Plugins.FOD
{
	public class FODPlugin : BaseUniAPIPlugin
	{
		public FODPlugin() : base(
			new Guid("16dfff1f-5be9-4d51-9bf7-5d85796f2967"),
			"FeatherTracker Food",
			new List<Guid>()
			{
				new Guid("1ae27478-9875-4a9e-8df0-ac0cc2448bd4")
			})
		{
		}
	}
}
