import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BirdModel } from '../../../../../models/Core/birdModel';
import { TableModule } from 'primeng/table';
import { ListBirdModel } from '../../../../../models/Core/listBirdModel';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogHelpers } from '../../../helpers/confirmdialoghelpers';
import { APIURL } from '../../../../../../globals';
import { Endpoints } from '../../../../../../Endpoints';
import { JWTTokenHelpers } from '../../../helpers/jwtTokenHelpers';
import { CreatedUpdatedControl } from "../../../../../common/createdupdatedcontrol";
import { FloatTextInput } from "../../../../../common/floattextinput";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditorModule } from 'primeng/editor';
import { DatePickerControl } from "../../../../../common/datepickercontrol";
import { DateHelpers } from '../../../../../helpers/dateHelpers';

@Component({
    selector: 'app-birds-components-birdeditor',
    imports: [FormsModule, CommonModule, DialogModule, TableModule, ButtonModule, CreatedUpdatedControl, FloatTextInput, ConfirmDialogModule, EditorModule, DatePickerControl],
    template: `
        <p-table [value]="allBirds" [scrollable]="true" styleClass="mt-4" [loading]="isLoading">
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <p-button icon="pi pi-plus" label="Add Bird" rounded raised (click)="showAddBird()" [hidden]="!canWrite" />
                    <p-button icon="pi pi-refresh" rounded raised (click)="loadBirds()" />
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width:55px"></th>
                    <th class="font-bold">Name</th>
                    <th>Type</th>
                    <th>Age</th>
                </tr>
            </ng-template>
            <ng-template #body let-bird>
                <tr (click)="showEditBird(bird.id)" class="rowclickable">
                    <td>
                        <img [src]="bird.icon" style="min-width:50px;min-height:50px;max-width:50px;max-height:50px;border-radius:50%"/>
                    </td>
                    <td class="font-bold">{{ bird.name }}</td>
                    <td>{{ bird.type }}</td>
                    <td>{{ formatDateDiff(bird.birthDate) }}</td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="showDialog" [breakpoints]="{ '960px': '95vw' }" [style]="{ width: '50vw' }" [modal]="true" [draggable]="false">
            <ng-template #header>
                <div class="inline-flex items-center justify-center gap-2">
                    <span class="font-bold whitespace-nowrap">{{ currentBird.name }}</span>
                    <app-createdupdated [createdAt]="currentBird.createdAt" [updatedAt]="currentBird.updatedAt" />
                </div>
            </ng-template>
            <div class="card flex flex-col gap-2">
                <div class="flex flex-row gap-2">
                    <label for="imageselect">
                        <img [src]="currentBird.icon" style="min-width:81px;min-height:81px;max-width:81px;max-height:81px;border-radius:50%;cursor:pointer"/>
                    </label>
                    <input type="file" id="imageselect" accept="image/*" style="display:none;" (change)="changeIcon($event)">
                    <div class="flex flex-col gap-2 w-full">
                        <app-floattextinput [(value)]="currentBird.name" [disabled]="!canWrite" label="Name" icon="pi-pen-to-square" class="w-full"/>
                        <app-floattextinput [(value)]="currentBird.type" [disabled]="!canWrite" label="Type" icon="pi-sign-in" class="w-full" />
                    </div>
                </div>
                <app-datepicker [(value)]="currentBird.birthDate" label="Birthday" icon="pi-calendar"/>
                <p-editor [(ngModel)]="currentBird.description" [style]="{ height: '150px' }" [readonly]="!canWrite" />
            </div>
            <ng-template #footer>
                <p-button label="Save" icon="pi pi-save" (click)="saveBird()" [hidden]="!canWrite" />
                <p-confirmdialog />
                <p-button icon="pi pi-times" label="Delete" severity="danger" (click)="deleteBird(currentBird.id)" [hidden]="!canWrite || currentBird.id == ''"></p-button>
            </ng-template>
        </p-dialog>
    `
})
export class BirdEditor {
    @Input() canRead: boolean = false;
    @Input() canWrite: boolean = false;

    showDialog: boolean = false;
    isLoading: boolean = true;
    allBirds: ListBirdModel[] = [];
    currentBird: BirdModel = {} as BirdModel;

    constructor(
        private http: HttpClient,
        private service: MessageService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit(){
        this.loadBirds();
    }
    
    showAddBird() {
        this.currentBird = {
            id: '',
            name: 'name',
            description: 'description',
            type: 'type',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAACXUlEQVR4Xu3aQYriQBTG8Ze5QfACYnTtwlq6NrmBuUI2HiCeQC8SwbWgKxdxF4VcQFcuE8QT1GxmQqe6YWzmo/OE7wdCtJ7Q/AlWoe1Za63Qf/nlvkDfx4gAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAqiLebjdZLpcSRZF4ntc8hsOhxHEsm83GfYsOVok0Ta2I/PNhjLFlWbpv75RnFfxDUxRFcjgcmudBEMhsNpN+vy8iItvtVs7nc7Pu+74cj0cZj8fNa51yq/601WrVutPSNHVHrLXW5nlufd9v5oIgsFVVuWOd6DzixzDz+dxdbinLshU8yzJ3pBOdRszzvBXler26I58kSdLMJ0niLnei0935fr9LGIZijBFjjAwGA3fkk7+fk/JnN9eg04hxHMt+v5eiKKQoCnf5S8/ns7meTCatta6o2J1fVde1jEYjeTweIiKS57lMp1N37Md1eid+R13XEkVREzAMQxUBRRQccV5RlmVrFzfGqDne2K5351dkWaY6oNUecbfbtY5ASZKoC2g1R6yqqnUHajkTfkVtxI9fSIRh6C6ronZ3vlwuzfVisWitaaP2nOh5XnNdVZX0er3WuiZvEVHpn9hQG/GdqP1MfCeMCKAy4ul0av1QtV6v3RFVVEZ8N4wIwIgAPOIA8E4EYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRIDfog0jIDoFSggAAAAASUVORK5CYII=',
            userID: JWTTokenHelpers.GetUserID(),
            birthDate: new Date()
        } as BirdModel;
        this.showDialog = true;
    }

    showEditBird(userID: string) {
        this.http.get<BirdModel>(APIURL + Endpoints.Birds.Get_Bird + '?ID=' + userID).subscribe((u) => {
            this.currentBird = u;
            this.currentBird.birthDate = new Date(<Date>this.currentBird.birthDate);
            this.showDialog = true;
        });
    }

    deleteBird(userID: string) {
        this.confirmationService.confirm({
            ...ConfirmDialogHelpers.DeleteContent(),
            message: 'Are you sure you want to delete this bird?',
            accept: () => {
                this.http.delete(APIURL + Endpoints.Birds.Delete_Bird + '?ID=' + userID).subscribe(() => {
                    this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bird deleted!' });
                    this.showDialog = false;
                    this.loadBirds();
                });
            }
        });
    }

    loadBirds() {
        this.isLoading = true;
        this.http.get<ListBirdModel[]>(APIURL + Endpoints.Birds.Get_AllBirds).subscribe((l) => {
            l.forEach(b => b.birthDate = new Date(<Date>b.birthDate))
            this.allBirds = l;
            this.isLoading = false;
        });
    }

    saveBird() {
        if (this.currentBird.id == '') {
            this.http.post<BirdModel>(APIURL + Endpoints.Birds.Post_AddBird, this.currentBird).subscribe(() => {
                this.showDialog = false;
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bird created!' });
                this.loadBirds();
            });
        } else {
            this.http.patch<BirdModel>(APIURL + Endpoints.Birds.Patch_UpdateBird, this.currentBird).subscribe(() => {
                this.showDialog = false;
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bird updated!' });
                this.loadBirds();
            });
        }
    }

    changeIcon(event : Event){
        if (event.target && 'files' in event.target)
        {
            var file = (<FileList>event.target.files)[0];
            if (file.size > 2097152)
            {
                alert("Image is too large! A maximum of 2mb images are supported")
                return;
            }
            this.getBase64(file).then(d => this.currentBird.icon = <string>d)
        }
    }

    getBase64(file : File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    formatDateDiff(date : Date) : string {
        var now = new Date();
        var yearDiff = DateHelpers.DiffinYears(date, now);
        if (yearDiff > 0)
        {
            if (yearDiff == 1)
                return yearDiff + " year"
            else
                return yearDiff + " years"
        }
        var monthDiff = DateHelpers.DiffinMonths(date, now);
        if (monthDiff > 0)
        {
            if (monthDiff == 1)
                return monthDiff + " month"
            else
                return monthDiff + " months"
        }
        var dayDiff = DateHelpers.DiffinDays(date, now);
        if (dayDiff > 0)
        {
            if (dayDiff == 1)
                return dayDiff + " day"
            else
                return dayDiff + " days"
        }
        return "Less than a day old"
    }
}
