using CommandLine;
using CommandLine.Text;
using FeatherTracker.API.Models;
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
			CreateUniAPIBuilder<Startup>(opts).Run();
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

		private static WebApplication CreateUniAPIBuilder<T>(Options opt) where T : UniAPIStartup
		{
			var builder = WebApplication.CreateBuilder();
			var dict = new Dictionary<string, string>();
			dict.Add("UsePlugins:[0]", "COR");
			dict.Add("UsePlugins:[1]", "WGT");
			dict.Add("UsePlugins:[2]", "FOD");
			dict.Add("COR:JWTLifetime", $"{opt.JWTLifetime}");
			dict.Add("COR:APIURL", $"{opt.APIUrl}");
			dict.Add("COR:DatabaseConnectionString", opt.DBConnectionString);
			builder.Configuration.AddInMemoryCollection(dict);

			var startup = Activator.CreateInstance<T>();

			startup.LoadPlugins(builder.Configuration);

			startup.ConfigureServices(builder.Services, builder.Configuration);

			var app = builder.Build();

			startup.Configure(app, app.Environment);

			return app;
		}
	}
}