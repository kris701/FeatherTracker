import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Endpoints } from '../../../../../Endpoints';
import { FloatDatePicker } from "../../../../common/components/floatdatepicker";
import { FloatDialog } from "../../../../common/components/floatdialog";
import { FloatMarkdownEditor } from "../../../../common/components/floatmarkdowneditor";
import { FloatTable } from "../../../../common/components/floattable";
import { FloatTextInput } from "../../../../common/components/floattextinput";
import { TableDateFilterColumn, TableTextFilterColumn } from '../../../../common/components/tables/filtercolumns';
import { TableDateRow, TableTagRow } from '../../../../common/components/tables/filterrows';
import { compressImage } from '../../../../common/helpers/compressImage';
import { BaseCRUDInterface } from '../../../../common/interfaces/baseCRUDInterface';
import { BirdModel } from '../../../../models/COR/birdModel';

@Component({
    selector: 'app-cor-birds',
    imports: [
    FormsModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    MultiSelectModule,
    PasswordModule,
    TableModule,
    EditorModule,
    TagModule,
    TableTextFilterColumn,
    TableDateFilterColumn,
    TableTagRow,
    TableDateRow,
    SplitterModule,
    TextareaModule,
    FloatTable,
    FloatDialog,
    FloatDatePicker,
    FloatTextInput,
    FloatMarkdownEditor
],
    template: `
        <app-floattable [values]="allItems" stateKey="cor-birds-session" [isLoading]="isLoading" [showAdd]="canWrite" (onAddItem)="showAddItem()" (onLoadItems)="loadItems()" (onShowItem)="showEditItem($event)" [interface]="this" [showContextMenu]="true" [showImport]="true">
            <ng-template #tableHeader>
                <th style="width:40px"></th>
                <th textfiltercolumn pSortableColumn="name" displayName="Name"></th>
                <th datefiltercolumn pSortableColumn="birthDate" displayName="Birthdate"></th>
            </ng-template>
            <ng-template #tableRows let-item>
                <td>
                    <img [src]="item.icon" style="min-width:30px;min-height:30px;max-width:30px;max-height:30px;border-radius:50%;cursor:pointer"/>
                </td>
                <td tagrow [value]="item.name"></td>
                <td daterow [value]="item.birthDate"></td>
            </ng-template>
        </app-floattable>

        <app-floatdialog [currentItem]="currentItem" [(showDialog)]="showDialog" (onSaveItem)="saveItem()" (onDeleteItem)="deleteItem()" [canWrite]="canWrite" [style]="{'width':'80vw','height':'80vh'}">
            <ng-template #body>
                <div class="flex flex-col gap-2 w-full h-full">
                    <div class="flex flex-row gap-2">
                        <label for="imageselect">
                            <img [src]="currentItem.icon" style="min-width:81px;min-height:81px;max-width:81px;max-height:81px;border-radius:50%;cursor:pointer"/>
                        </label>
                        <input type="file" id="imageselect" accept="image/*" style="display:none;" (change)="changeIcon($event)">
                        <div class="flex flex-col gap-2 w-full">
                            <app-floattextinput [(value)]="currentItem.name" [disabled]="!canWrite" label="Name" icon="pi-pen-to-square" class="w-full"/>
                            <app-floattextinput [(value)]="currentItem.type" [disabled]="!canWrite" label="Type" icon="pi-sign-in" class="w-full" />
                        </div>
                    </div>
                    <app-floatdatepicker [(value)]="currentItem.birthDate" label="Birthday" icon="pi-calendar"/>
                    <app-floatmarkdowneditor [(value)]="currentItem.description"/>
                </div>
            </ng-template>
        </app-floatdialog>
    `,
    host: {
        class: 'card flex flex-col flex-grow'
    }
})
export class CORBirds extends BaseCRUDInterface {
    override newItemTemplate(): any {
        return {
            id:'',
            name: 'New Bird',
            description: 'description',
            type: '',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAACXUlEQVR4Xu3aQYriQBTG8Ze5QfACYnTtwlq6NrmBuUI2HiCeQC8SwbWgKxdxF4VcQFcuE8QT1GxmQqe6YWzmo/OE7wdCtJ7Q/AlWoe1Za63Qf/nlvkDfx4gAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAjAjAiACMCMCIAIwIwIgAqiLebjdZLpcSRZF4ntc8hsOhxHEsm83GfYsOVok0Ta2I/PNhjLFlWbpv75RnFfxDUxRFcjgcmudBEMhsNpN+vy8iItvtVs7nc7Pu+74cj0cZj8fNa51yq/601WrVutPSNHVHrLXW5nlufd9v5oIgsFVVuWOd6DzixzDz+dxdbinLshU8yzJ3pBOdRszzvBXler26I58kSdLMJ0niLnei0935fr9LGIZijBFjjAwGA3fkk7+fk/JnN9eg04hxHMt+v5eiKKQoCnf5S8/ns7meTCatta6o2J1fVde1jEYjeTweIiKS57lMp1N37Md1eid+R13XEkVREzAMQxUBRRQccV5RlmVrFzfGqDne2K5351dkWaY6oNUecbfbtY5ASZKoC2g1R6yqqnUHajkTfkVtxI9fSIRh6C6ronZ3vlwuzfVisWitaaP2nOh5XnNdVZX0er3WuiZvEVHpn9hQG/GdqP1MfCeMCKAy4ul0av1QtV6v3RFVVEZ8N4wIwIgAPOIA8E4EYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRABGBGBEAEYEYEQARgRgRIDfog0jIDoFSggAAAAASUVORK5CYII=',
            birthDate: ''
        } as BirdModel;
    }

    override getAllEndpoint: string = Endpoints.COR.Birds.Get_AllBirds;
    override getEndpoint: string = Endpoints.COR.Birds.Get_Bird;
    override patchEndpoint: string = Endpoints.COR.Birds.Patch_UpdateBird;
    override postEndpoint: string = Endpoints.COR.Birds.Post_AddBird;
    override deleteEndpoint: string = Endpoints.COR.Birds.Delete_Bird;

    async changeIcon(event : Event){
        if (event.target && 'files' in event.target)
        {
            var file = (<FileList>event.target.files)[0];
            if (file.size > 2097152)
            {
                alert("Image is too large! A maximum of 2mb images are supported")
                return;
            }
            var compressed = await compressImage(file, 0.5, 300, 300);
            var asBase64 = await this.toBase64(compressed as File);
            this.currentItem.icon = asBase64;
        }
    }

    toBase64(file : File){
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        })
    }
}
