import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import saveAs from 'file-saver';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-filehandler',
    imports: [FormsModule, CommonModule, ButtonModule, DrawerModule, TableModule, TagModule],
    template: `
        <p-drawer [(visible)]="isVisible" header="Files" [style]="{ 'min-width': '40vw' }">
            <input type="file" (change)="onFileSelected($event)" #fileUpload [style]="{ display: 'none' }" multiple />

            <div class="file-upload">
                <p-table [value]="files" [loading]="isLoading">
                    <ng-template #caption>
                        <div class="flex items-center justify-between">
                            <p-button icon="pi pi-plus" label="Add"  (click)="fileUpload.click()" [hidden]="!canWrite" />
                            <p-button icon="pi pi-refresh"  (click)="loadFiles()" [hidden]="getAllEndpoint == ''" />
                        </div>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th class="font-bold">State</th>
                            <th class="font-bold">Name</th>
                            <th>Size</th>
                            <th></th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-attachment>
                        <tr>
                            @if (!attachment.id || attachment.id == '') {
                                <td class="font-bold"><p-tag severity="info">New</p-tag></td>
                                <td class="font-bold">{{ attachment.name }}</td>
                                <td>{{ formatSize(attachment.size) }}</td>
                                <td>
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <p-button severity="danger" label="Delete"  (click)="removeFile(attachment)" [hidden]="!canWrite" />
                                    </div>
                                </td>
                            } @else {
                                <td class="font-bold"><p-tag severity="success">Existing</p-tag></td>
                                <td class="font-bold">{{ attachment.name }}</td>
                                <td>{{ formatSize(attachment.size) }}</td>
                                <td>
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <p-button color="primary" label="Download"  (click)="downloadFile(attachment.id, attachment.name)" [hidden]="!canRead" />
                                        <p-button severity="danger" label="Delete"  (click)="removeFile(attachment)" [hidden]="!canWrite" />
                                    </div>
                                </td>
                            }
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-drawer>
    `
})
export class FileHandlerComponent implements OnChanges {
    isVisible: boolean = false;

    public initialFiles: File[] = [];
    public files: File[] = [];
    @Input() canRead: boolean = false;
    @Input() canWrite: boolean = false;

    @Input() deleteEndpoint: string = '';
    @Input() postEndpoint: string = '';
    @Input() getEndpoint: string = '';
    @Input() getAllEndpoint: string = '';
    @Input() clearOnSubmit: boolean = false;
    public isLoading: boolean = false;

    constructor(
        private http: HttpClient,
        private service: MessageService
    ) {}

    toggleVisibility() {
        this.isVisible = !this.isVisible;
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (this.getAllEndpoint != undefined && this.getAllEndpoint != '') await this.loadFiles();
    }

    async loadFiles() {
        if (this.getAllEndpoint == '') return;
        this.clear();
        this.isLoading = true;
        var r = await firstValueFrom(this.http.get<File[]>(this.getAllEndpoint));
        this.initialFiles = [...r];
        this.files = [...r];
        this.isLoading = false;
    }

    public clear() {
        this.files = [];
        this.initialFiles = [];
    }

    public async submit() {
        var toRemove = this.initialFiles.filter((x) => !this.files.includes(x));
        var toAdd = this.files.filter((x) => !this.initialFiles.includes(x));

        if (toRemove.length > 0 && this.deleteEndpoint == '') this.service.add({ severity: 'warn', summary: 'Warning Message', detail: 'No endpoint was set for deleting a file!!' });
        else
            await Promise.all(
                toRemove.map((x) => {
                    return firstValueFrom(this.http.delete(this.deleteEndpoint + '?ID=' + (<any>x).id));
                })
            );
        if (toAdd.length > 0 && this.postEndpoint == '') this.service.add({ severity: 'warn', summary: 'Warning Message', detail: 'No endpoint was set for uploading a file!!' });
        else
            await Promise.all(
                toAdd.map((x) => {
                    const formData = new FormData();
                    formData.append('file', x);
                    return firstValueFrom(this.http.post(this.postEndpoint, formData));
                })
            );

        if (this.clearOnSubmit) this.clear();

        await this.loadFiles();
    }

    onFileSelected(event: any) {
        var files: File[] = Array.from(event.target.files);
        if (files) {
            files.forEach((f) => {
                this.files.push(f);
            });
        }
    }

    removeFile(file: File) {
        if (file) this.files = this.files.filter((x) => x != file);
    }

    async downloadFile(id: string, name: string) {
        var response = await firstValueFrom(this.http.get(this.getEndpoint + '?ID=' + id, { responseType: 'blob' }));
        saveAs(response, name);
    }

    formatSize(bytes: number) {
        if (bytes === 0) {
            return `0 B`;
        }
        if (bytes < 1000) {
            return `${bytes} B`;
        }
        if (bytes < 1000000) {
            return `${Math.floor(bytes / 1000)} KB`;
        }
        return `${Math.floor(bytes / 1000000)} MB`;
    }
}
