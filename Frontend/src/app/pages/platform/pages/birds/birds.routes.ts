import { Routes } from '@angular/router';
import { PermissionHelpers } from '../../helpers/permissionHelpers';
import { PermissionsTable } from '../../../../../PermissionsTable';
import { BirdsEditBirds } from './birds.editbirds';
import { BirdsWeightTracking } from './birds.weighttracking';

export default [
    { path: 'editbirds', component: BirdsEditBirds, canActivate : [() => PermissionHelpers.HasPermission(PermissionsTable.Birds_Read)] },
    { path: 'weighttracking', component: BirdsWeightTracking, canActivate : [() => PermissionHelpers.HasPermission(PermissionsTable.Birds_Weight_Read)] },
] as Routes;
