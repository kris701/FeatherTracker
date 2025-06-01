import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Endpoints } from '../../../../../Endpoints';
import { APIURL } from '../../../../../globals';
import { PermissionsTable } from '../../../../../PermissionsTable';
import { FloatTextInput } from '../../../../common/floattextinput';
import { ToggleSwitchLabel } from '../../../../common/toggleswitchlabel';
import { BugReportModel } from '../../../../models/BugReports/bugReportModel';
import { ConfirmDialogHelpers } from '../../helpers/confirmdialoghelpers';
import { PermissionHelpers } from '../../helpers/permissionHelpers';
import { DateHelpers } from '../../../../helpers/dateHelpers';

@Component({
    selector: 'app-bugreports-reports',
    imports: [FormsModule, CommonModule, DialogModule, ButtonModule, FloatLabelModule, InputTextModule, EditorModule, TableModule, ToggleSwitchModule, FloatTextInput, ToggleSwitchLabel],
    template: `
        <div class="card">
            <label>View and edit all the current bug reports that have been made.</label>
        </div>

        <div class="card">
            <p-table [value]="allReports" [scrollable]="true" styleClass="mt-4" [loading]="isLoading" sortField="isResolved" [sortOrder]="1">
                <ng-template #caption>
                    <div class="flex items-center justify-between">
                        <p-button icon="pi pi-refresh" rounded raised (click)="loadReports()" />
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th class="font-bold">Title</th>
                        <th pSortableColumn="isResolved">Is Resolved <p-sortIcon field="isResolved" /></th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </ng-template>
                <ng-template #body let-report>
                    <tr (click)="showEditReport(report.id)" class="rowclickable">
                        <td class="font-bold">{{ report.title }}</td>
                        <td>{{ report.isResolved }}</td>
                        <td>{{ prettyDate(report.createdAt) }}</td>
                        <td>{{ prettyDate(report.updatedAt) }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="isModalVisible" [modal]="true" [breakpoints]="{ '960px': '95vw' }">
            <ng-template #header>
                <div class="inline-flex items-center justify-center gap-2">
                    <span class="font-bold whitespace-nowrap">{{ currentReport.title }}</span>
                </div>
            </ng-template>
            <div class="card flex flex-col gap-2">
                @if (currentReport.id != '') {
                    <span class="text-surface-500 dark:text-surface-400">Created {{ prettyDate(currentReport.createdAt) }}</span>
                    @if (haveBeenEdited()) {
                        <span class="text-surface-500 dark:text-surface-400">Updated {{ prettyDate(currentReport.updatedAt) }}</span>
                    }
                }
                <app-floattextinput [(value)]="currentReport.title" [disabled]="!canWrite" label="Title" icon="pi-pencil" />
                <p-editor [(ngModel)]="currentReport.description" [style]="{ height: '150px' }" />
                <app-toggleswitchlabel [(value)]="currentReport.isResolved" label="Is Resolved?" [disabled]="!canWrite" class="w-full " />
            </div>
            <ng-template #footer>
                <p-button label="Save" icon="pi pi-save" (click)="saveReport()" [hidden]="!canWrite" />
                <p-button icon="pi pi-times" label="Delete" severity="danger" (click)="deleteReport(currentReport.id)" [hidden]="!canWrite || currentReport.id == ''"></p-button>
            </ng-template>
        </p-dialog>
    `
})
export class BugReportsReports {
    allReports: BugReportModel[] = [];
    currentReport: BugReportModel = {} as BugReportModel;
    isModalVisible: boolean = false;
    showResolved: boolean = false;
    isLoading: boolean = true;

    canRead: boolean = PermissionHelpers.HasPermission(PermissionsTable.BugReports_Reports_Read);
    canWrite: boolean = PermissionHelpers.HasPermission(PermissionsTable.BugReports_Reports_Write);

    constructor(
        private http: HttpClient,
        private service: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        if (this.canRead) this.loadReports();
    }

    prettyDate(input: string | Date | null): string {
        return DateHelpers.PrettyDate(input);
    }

    haveBeenEdited() {
        return this.currentReport.updatedAt != null && this.currentReport.updatedAt != '';
    }

    loadReports() {
        this.allReports = [];
        this.isLoading = true;
        this.http.get<BugReportModel[]>(APIURL + Endpoints.BugReports.Get_AllReports).subscribe((r) => {
            this.allReports = r;
            this.isLoading = false;
        });
    }

    showEditReport(id: string) {
        this.http.get<BugReportModel>(APIURL + Endpoints.BugReports.Get_Report + '?ID=' + id).subscribe((r) => {
            this.currentReport = r;
            this.isModalVisible = true;
        });
    }

    saveReport() {
        this.http.patch(APIURL + Endpoints.BugReports.Patch_UpdateReport, this.currentReport).subscribe((r) => {
            this.isModalVisible = false;
            this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bug report updated!' });
            this.loadReports();
        });
    }

    deleteReport(id: string) {
        this.confirmationService.confirm({
            ...ConfirmDialogHelpers.DeleteContent(),
            message: 'Are you sure you want to delete this bug report?',
            accept: () => {
                this.http.delete(APIURL + Endpoints.BugReports.Delete_Report + '?ID=' + id).subscribe(() => {
                    this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bug report deleted!' });
                    this.isModalVisible = false;
                    this.loadReports();
                });
            }
        });
    }
}
