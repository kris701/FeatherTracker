using DatabaseSharp;
using FeatherTracker.Plugins.Core.DatabaseInterface.Permissions;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FeatherTracker.Plugins.Birds.Services
{
	public class PermissionBackgroundService : BackgroundService
	{
		private readonly AddPermissionIfNotExistModel _model;

		public PermissionBackgroundService([FromKeyedServices(BirdsPlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_model = new AddPermissionIfNotExistModel(dbClient);
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Birds_Read,
				"Read All Your Birds",
				"Ability to read all your birds.",
				false));
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Birds_Write,
				"Write All Your Birds",
				"Ability to create, update and delete birds.",
				false));

			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Birds_Weight_Read,
				"Read All Your Bird Weights",
				"Ability to read all your birds weights.",
				false));
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Birds_Weight_Write,
				"Write All Your Bird Weights",
				"Ability to create, update and delete birds weights.",
				false));
		}
	}
}
