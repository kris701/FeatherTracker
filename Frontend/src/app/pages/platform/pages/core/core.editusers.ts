import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UserEditor } from './components/usereditor';
import { PermissionsTable } from '../../../../../PermissionsTable';
import { PermissionHelpers } from '../../helpers/permissionHelpers';
@Component({
    selector: 'app-core-company-editusers',
    imports: [FormsModule, CommonModule, DialogModule, ButtonModule, FloatLabelModule, InputTextModule, MultiSelectModule, PasswordModule, TableModule, ChipModule, TooltipModule, ConfirmDialogModule, TagModule, UserEditor],
    template: `
        <div class="card">
            <p>Here you can add, edit and remove users from the system.</p>
            <p-tag severity="warn">Do remember, if you update the permissions for a user (including yourself) they will have to log out and log back in again for the changes to take effect.</p-tag>
        </div>
        <div class="card">
            <app-company-components-usereditor
                [canRead]="canRead"
                [canWrite]="canWrite"
                [canReadPermissions]="canReadPermissions"
            />
        </div>
    `
})
export class CoreEditUsers {
    canRead: boolean = PermissionHelpers.HasPermission(PermissionsTable.Core_Users_Read);
    canWrite: boolean = PermissionHelpers.HasPermission(PermissionsTable.Core_Users_Write);
    canReadPermissions: boolean = PermissionHelpers.HasPermission(PermissionsTable.Core_Permission_Read);
}
