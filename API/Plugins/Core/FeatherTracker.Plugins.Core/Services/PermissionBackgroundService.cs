using DatabaseSharp;
using FeatherTracker.Plugins.Core.DatabaseInterface;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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
				"Read All Users",
				"Ability to create, update and delete users.",
				true));

			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_User_Impersonate,
				"Impersonating",
				"Ability to impersonate any one user.",
				true));
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_User_ChangePassword,
				"Change Password",
				"Ability to change your own password.",
				false));
			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_User_EditProfile,
				"Edit your profile",
				"Ability to edit your own user.",
				false));

			await _model.ExecuteAsync(new PermissionModel(
				PermissionsTable.Core_Permission_Read,
				"Permission Read",
				"Ability to fetch all permissions names and descriptions.",
				true));
		}
	}
}
