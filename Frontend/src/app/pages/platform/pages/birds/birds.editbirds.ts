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
import { PermissionsTable } from '../../../../../PermissionsTable';
import { PermissionHelpers } from '../../helpers/permissionHelpers';
@Component({
    selector: 'app-birds-editusers',
    imports: [FormsModule, CommonModule, DialogModule, ButtonModule, FloatLabelModule, InputTextModule, MultiSelectModule, PasswordModule, TableModule, ChipModule, TooltipModule, ConfirmDialogModule, TagModule],
    template: `
        <div class="card">
            <p>Here you can add and modify your birds.</p>
        </div>
        <div class="card">

        </div>
    `
})
export class BirdsEditBirds {
}
