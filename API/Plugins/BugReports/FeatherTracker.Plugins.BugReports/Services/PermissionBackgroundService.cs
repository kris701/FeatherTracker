using DatabaseSharp;
using FeatherTracker.Plugins.Core.DatabaseInterface.Permissions;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FeatherTracker.Plugins.BugReports.Services
{
	public class PermissionBackgroundService : BackgroundService
	{
		private readonly AddPermissionIfNotExistModel _model;

		public PermissionBackgroundService([FromKeyedServices(BugReportsPlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_model = new AddPermissionIfNotExistModel(dbClient);
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.BugReports_Reports_Write,
				"Bug Reports Write",
				"Ability to create bug reports.",
				false));
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.BugReports_Reports_Read,
				"Bug Reports Read",
				"Ability to read bug reports.",
				true));

			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.BugReports_Statistics_Read,
				"Bugreports Statistics Read",
				"Ability to read statistics about bug reports.",
				true));
		}
	}
}
