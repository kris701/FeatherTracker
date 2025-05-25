using Uni.API;

namespace FeatherTracker.API
{
	public class Program
	{
		public static void Main(string[] args)
		{
			UniAPIBuilder.CreateUniAPIBuilder<Startup>(
				args
#if DEBUG
				, "configuration-debug.json"
#endif
				).Build().Run();
		}
	}
}