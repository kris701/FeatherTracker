using Uni.API;

namespace FeatherTracker.API
{
	public class Program
	{
		public static void Main(string[] args)
		{
			UniAPIBuilder.CreateUniAPIBuilder<Startup>(args).Build().Run();
		}
	}
}