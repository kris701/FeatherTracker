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
import { WeightTracker } from "./components/weighttracker";
import { ListBirdModel } from '../../../../models/Core/listBirdModel';
import { BirdModel } from '../../../../models/Core/birdModel';
import { HttpClient } from '@angular/common/http';
import { APIURL } from '../../../../../globals';
import { Endpoints } from '../../../../../Endpoints';
import { FloatSelectControl } from "../../../../common/floatselectcontrol";

@Component({
    selector: 'app-birds-weighttracking',
    imports: [FormsModule, CommonModule, DialogModule, ButtonModule, FloatLabelModule, InputTextModule, MultiSelectModule, PasswordModule, TableModule, ChipModule, TooltipModule, ConfirmDialogModule, TagModule, WeightTracker, FloatSelectControl],
    template: `
        <div class="card">
            <p>Here you can track your birds weight.</p>
        </div>
        <div class="card">
            <app-floatselect [options]="allBirds" [(selected)]="currentBird" optionLabel="name" label="Select Bird"/>
            <app-birds-components-weighttracker
                [canRead]="canRead"
                [canWrite]="canWrite"
                [currentBird]="currentBird"
            />
        </div>
    `
})
export class BirdsWeightTracking {
    canRead: boolean = PermissionHelpers.HasPermission(PermissionsTable.Birds_Weight_Read);
    canWrite: boolean = PermissionHelpers.HasPermission(PermissionsTable.Birds_Weight_Write);

    allBirds: ListBirdModel[] = [];
    currentBird: BirdModel = {} as BirdModel;

    constructor(
        private http: HttpClient
    ) {}

    ngOnInit(){
        this.loadBirds();
    }

    loadBirds() {
        this.http.get<ListBirdModel[]>(APIURL + Endpoints.Birds.Get_AllBirds).subscribe((l) => {
            l.forEach(b => b.birthDate = new Date(<Date>b.birthDate))
            this.allBirds = l;
        });
    }
}
