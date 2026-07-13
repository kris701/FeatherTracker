using FeatherTracker.API.Filters;
using Microsoft.OpenApi;
using System.Reflection;
using Uni.API;

namespace FeatherTracker.API
{
	public class Startup : UniAPIStartup
	{
		public Startup()
		{
			PluginNamespaces = new List<string>()
			{
				DefaultPluginNamespace,
				"Helvion.CargoBI.API.Modules",
				"FeatherTracker.Plugin"
			};
		}

		public override void ConfigureServices(IServiceCollection services, ConfigurationManager configuration)
		{
			services.AddSwaggerGen(c =>
			{
				var thisVersion = Assembly.GetEntryAssembly()?.GetName().Version!;
				var thisVersionStr = $"v{thisVersion.Major}.{thisVersion.Minor}.{thisVersion.Build}";

				c.SwaggerDoc("v1", new OpenApiInfo { Title = "Helvion.CargoBI API", Version = thisVersionStr });
				var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
				c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

				c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
					Name = "Authorization",
					In = ParameterLocation.Header,
					Type = SecuritySchemeType.ApiKey,
					Scheme = "Bearer"
				});
				c.OperationFilter<AuthorizeCheckOperationFilter>();
			});
			base.ConfigureServices(services, configuration);
		}

		public override void Configure(WebApplication app, IWebHostEnvironment env)
		{
			app.UseCors(o =>
			{
				o.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
			});
			app.UseSwagger();
			app.UseSwaggerUI();
			app.UseHttpsRedirection();
			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseEndpoints(delegate (IEndpointRouteBuilder endpoints)
			{
				endpoints.MapControllers();
			});
		}
	}
}
