import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService, ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { EditorModule } from "primeng/editor";
import { TableModule } from "primeng/table";
import { Endpoints } from "../../../../../Endpoints";
import { APIURL } from "../../../../../globals";
import { PermissionsTable } from "../../../../../PermissionsTable";
import { CreatedUpdatedControl } from "../../../../common/createdupdatedcontrol";
import { DatePickerControl } from "../../../../common/datepickercontrol";
import { FloatTextInput } from "../../../../common/floattextinput";
import { DateHelpers } from "../../../../helpers/dateHelpers";
import { BirdModel } from "../../../../models/Core/birdModel";
import { ListBirdModel } from "../../../../models/Core/listBirdModel";
import { ConfirmDialogHelpers } from "../../helpers/confirmdialoghelpers";
import { JWTTokenHelpers } from "../../helpers/jwtTokenHelpers";
import { PermissionHelpers } from "../../helpers/permissionHelpers";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AppMenu } from "../../layout/app.menu";

@Component({
    selector: 'app-birds-editbirds',
    imports: [FormsModule, CommonModule, DialogModule, TableModule, ButtonModule, FloatTextInput, ConfirmDialogModule, EditorModule, DatePickerControl],
    template: `
        <div class="card">
            <p>Here you can add and modify your birds.</p>
        </div>
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

            <p-button label="Save" icon="pi pi-save" (click)="saveBird()" [hidden]="!canWrite" fluid/>
            <p-confirmdialog />
            <p-button icon="pi pi-times" label="Delete" severity="danger" (click)="deleteBird(currentBird.id)" [hidden]="!canWrite || currentBird.id == ''" fluid></p-button>
        </div>
    `
})
export class BirdsEditBirds {
    canRead: boolean = PermissionHelpers.HasPermission(PermissionsTable.Birds_Read);
    canWrite: boolean = PermissionHelpers.HasPermission(PermissionsTable.Birds_Write);

    isLoading: boolean = true;
    currentBird: BirdModel = {} as BirdModel;

    route = inject(ActivatedRoute);
    loadedQueryOnce: boolean = false;
    constructor(
        private http: HttpClient,
        private service: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd){
                this.loadedQueryOnce = false;
                this.processQueryParameters();
            }
        })
    }

    ngOnInit(){
        this.processQueryParameters();
    }
    
    showAddBird() {
        this.currentBird = {
            id: '',
            name: 'New Bird',
            description: 'description',
            type: 'type',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAACXUlEQVR4Xu3aQYriQBTG8Ze5QfACYnTtwlq6NrmBuUI2HiCeQC8SwbWgKxdxF4VcQFcuE8QT1GxmQqe6YWzmo/OE7wdCtJ7Q/AlWoe1Za63Qf/nlvkDfx4gAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAqiLebjdZLpcSRZF4ntc8hsOhxHEsm83GfYsOVok0Ta2I/PNhjLFlWbpv75RnFfxDUxRFcjgcmudBEMhsNpN+vy8iItvtVs7nc7Pu+74cj0cZj8fNa51yq/601WrVutPSNHVHrLXW5nlufd9v5oIgsFVVuWOd6DzixzDz+dxdbinLshU8yzJ3pBOdRszzvBXler26I58kSdLMJ0niLnei0935fr9LGIZijBFjjAwGA3fkk7+fk/JnN9eg04hxHMt+v5eiKKQoCnf5S8/ns7meTCatta6o2J1fVde1jEYjeTweIiKS57lMp1N37Md1eid+R13XEkVREzAMQxUBRRQccV5RlmVrFzfGqDne2K5351dkWaY6oNUecbfbtY5ASZKoC2g1R6yqqnUHajkTfkVtxI9fSIRh6C6ronZ3vlwuzfVisWitaaP2nOh5XnNdVZX0er3WuiZvEVHpn9hQG/GdqP1MfCeMCKAy4ul0av1QtV6v3RFVVEZ8N4wIwIgAPOIA8E4EYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRIDfog0jIDoFSggAAAAASUVORK5CYII=',
            userID: JWTTokenHelpers.GetUserID(),
            birthDate: new Date()
        } as BirdModel;
    }

    showEditBird(birdId: string) {
        this.http.get<BirdModel>(APIURL + Endpoints.Birds.Get_Bird + '?ID=' + birdId).subscribe((u) => {
            this.currentBird = u;
            this.currentBird.birthDate = new Date(<Date>this.currentBird.birthDate);
        });
    }

    deleteBird(userID: string) {
        this.confirmationService.confirm({
            ...ConfirmDialogHelpers.DeleteContent(),
            message: 'Are you sure you want to delete this bird?',
            accept: () => {
                this.http.delete(APIURL + Endpoints.Birds.Delete_Bird + '?ID=' + userID).subscribe(() => {
                    this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bird deleted!' });
                    
                });
            }
        });
    }

    saveBird() {
        if (this.currentBird.id == '') {
            this.http.post<BirdModel>(APIURL + Endpoints.Birds.Post_AddBird, this.currentBird).subscribe((r) => {
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bird created!' });
                this.showEditBird(r.id);
            });
        } else {
            this.http.patch<BirdModel>(APIURL + Endpoints.Birds.Patch_UpdateBird, this.currentBird).subscribe((r) => {
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Bird updated!' });
                this.showEditBird(r.id);
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

    processQueryParameters() {
        if (this.loadedQueryOnce) return;
        this.loadedQueryOnce = true;
        if (this.route.snapshot.queryParamMap.has('id')) {
            var targetID = this.route.snapshot.queryParamMap.get('id');
            if (targetID) {
                this.showEditBird(targetID);
            }
        } else if (this.route.snapshot.queryParamMap.has('add')){
            this.showAddBird();
        }
    }
}
