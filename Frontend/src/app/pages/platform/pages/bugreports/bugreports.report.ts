import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Endpoints } from '../../../../../Endpoints';
import { APIURL } from '../../../../../globals';
import { PermissionsTable } from '../../../../../PermissionsTable';
import { FloatTextInput } from '../../../../common/floattextinput';
import { AddBugReportInput } from '../../../../models/BugReports/addBugReportInput';
import { PermissionHelpers } from '../../helpers/permissionHelpers';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-bugreports-report',
    imports: [FormsModule, CommonModule, DialogModule, ButtonModule, FloatLabelModule, InputTextModule, EditorModule, FloatTextInput, TagModule],
    template: `
        <div class="card flex flex-col">
            <label>Send a bug report of some issue you have found!</label>
            <label>Please try to make a good detailed description of the bug and how you got to it.</label>
            <label>Screenshots are also very helpful in tracking down the issue you have, so include as many as you want.</label>
        </div>

        <div class="card">
            <p-button label="Create Report" icon="pi pi-send" (click)="isModalVisible = true" [hidden]="!canWrite" />
        </div>

        <p-tag severity="success" class="w-full" *ngIf="haveSend">Thank you for submitting a bug report!</p-tag>

        <p-dialog header="Report a bug" [(visible)]="isModalVisible" [modal]="true" [breakpoints]="{ '960px': '95vw' }">
            <div class="card flex flex-col gap-2">
                <app-floattextinput [(value)]="currentReport.title" [disabled]="!canWrite" label="Title" icon="pi-pencil" />
                <p-editor [(ngModel)]="currentReport.description" [style]="{ height: '150px' }" />
            </div>
            <ng-template #footer>
                <p-button label="Send Report" icon="pi pi-send" (click)="sendReport()" [hidden]="!canWrite" />
            </ng-template>
        </p-dialog>
    `
})
export class BugReportsReport {
    isModalVisible: boolean = false;
    currentReport: AddBugReportInput = {
        title: 'New Report',
        description: 'Description'
    } as AddBugReportInput;
    haveSend: boolean = false;

    canWrite: boolean = PermissionHelpers.HasPermission(PermissionsTable.BugReports_Reports_Write);

    constructor(
        private http: HttpClient,
        private service: MessageService
    ) {}

    sendReport() {
        this.haveSend = false;
        this.http.post(APIURL + Endpoints.BugReports.Post_AddReport, this.currentReport).subscribe((r) => {
            this.currentReport = {
                title: 'New Report',
                description: 'Description'
            } as AddBugReportInput;
            this.haveSend = true;
            this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bug report send!' });
            this.isModalVisible = false;
        });
    }
}
