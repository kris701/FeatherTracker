import { Routes } from '@angular/router';
import { BugReportsReport } from './bugreports.report';
import { BugReportsReports } from './bugreports.reports';
import { PermissionsTable } from '../../../../../PermissionsTable';
import { PermissionHelpers } from '../../helpers/permissionHelpers';

export default [
    { path: 'reports', component: BugReportsReports, canActivate: [() => PermissionHelpers.HasPermission(PermissionsTable.BugReports_Reports_Read)] },
    { path: 'report', component: BugReportsReport, canActivate: [() => PermissionHelpers.HasPermission(PermissionsTable.BugReports_Reports_Write)] }
] as Routes;
