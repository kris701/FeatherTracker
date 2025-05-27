using DatabaseSharp;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FeatherTracker.Plugins.Core.DatabaseInterface.Permissions;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;

namespace FeatherTracker.Plugins.Core.Services
{
	public class PermissionBackgroundService : BackgroundService
	{
		private readonly AddPermissionIfNotExistModel _model;

		public PermissionBackgroundService([FromKeyedServices(CorePlugin.DBClientKeyName)] IDBClient dbClient)
		{
			_model = new AddPermissionIfNotExistModel(dbClient);
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_Users_Read,
				"Read All Users",
				"Ability to read all users.",
				true));
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_Users_Write,
				"Write All Users",
				"Ability to create, update and delete users.",
				true));

			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_User_Impersonate,
				"Impersonating",
				"Ability to impersonate any one user.",
				true));

			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_Users_Own_Read,
				"Read your own user",
				"Ability to read your own user.",
				false));
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_Users_Own_Write,
				"Write your own user",
				"Ability to modify your own user.",
				false));

			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_Permission_Read,
				"Permission Read",
				"Ability to fetch all permissions names and descriptions.",
				false));
		}
	}
}
