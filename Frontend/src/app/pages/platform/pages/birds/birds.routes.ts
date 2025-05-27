import { Routes } from '@angular/router';
import { PermissionHelpers } from '../../helpers/permissionHelpers';
import { PermissionsTable } from '../../../../../PermissionsTable';
import { BirdsEditBirds } from './birds.editbirds';

export default [
    { path: 'editbirds', component: BirdsEditBirds, canActivate : [() => PermissionHelpers.HasPermission(PermissionsTable.Birds_Read)] },
] as Routes;
