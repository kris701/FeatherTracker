import { Routes } from '@angular/router';
import { PermissionHelpers } from '../../helpers/permissionHelpers';
import { PermissionsTable } from '../../../../../PermissionsTable';
import { CoreEditUsers } from './core.editusers';

export default [
    { path: 'editusers', component: CoreEditUsers, canActivate : [() => PermissionHelpers.HasPermission(PermissionsTable.Core_Users_Write)] },
] as Routes;
