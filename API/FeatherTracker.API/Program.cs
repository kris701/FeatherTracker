using CommandLine;
using CommandLine.Text;
using FeatherTracker.API.Models;
using System.Text;
using Uni.API;

namespace FeatherTracker.API
{
	public class Program
	{
		static void Main(string[] args)
		{
			var parser = new Parser(with => with.HelpWriter = null);
			var parserResult = parser.ParseArguments<Options>(args);
			parserResult.WithNotParsed(errs => DisplayHelp(parserResult, errs));
			parserResult.WithParsed(Run);
		}

		public static void Run(Options opts)
		{
			CreateUniAPIBuilder<Startup>(opts).Build().Run();
		}

		private static void DisplayHelp<T>(ParserResult<T> result, IEnumerable<Error> errs)
		{
			var helpText = HelpText.AutoBuild(result, h =>
			{
				h.AddEnumValuesToHelpText = true;
				return h;
			}, e => e, verbsIndex: true);
			Console.WriteLine(helpText);
			HandleParseError(errs);
		}

		private static void HandleParseError(IEnumerable<Error> errs)
		{
			var sentenceBuilder = SentenceBuilder.Create();
			foreach (var error in errs)
				if (error is not HelpRequestedError)
					Console.WriteLine(sentenceBuilder.FormatError(error));
		}

		private static IHostBuilder CreateUniAPIBuilder<T>(Options opt) where T : UniAPIStartup
		{
			IHostBuilder hostBuilder = Host.CreateDefaultBuilder();
			hostBuilder.ConfigureAppConfiguration(delegate (HostBuilderContext context, IConfigurationBuilder config)
			{
				var dict = new Dictionary<string, string>();
				dict.Add("UsePlugins:[0]", "COR");
				dict.Add("UsePlugins:[1]", "WGT");
				dict.Add("COR:JWTSecret", opt.JWTSecret);
				dict.Add("COR:JWTLifetime", $"{opt.JWTLifetime}");
				dict.Add("COR:DatabaseConnectionString", opt.DBConnectionString);
				config.AddInMemoryCollection(dict);
			});
			hostBuilder.ConfigureWebHostDefaults(delegate (IWebHostBuilder webBuilder)
			{
				webBuilder.UseStartup<T>();
			});
			return hostBuilder;
		}
	}
}