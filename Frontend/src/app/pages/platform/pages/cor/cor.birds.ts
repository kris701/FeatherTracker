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
import { FloatDialog } from "../../../../common/components/floatdialog";
import { FloatTable } from "../../../../common/components/floattable";
import { TableDateFilterColumn, TableTextFilterColumn } from '../../../../common/components/tables/filtercolumns';
import { TableDateRow, TableTagRow } from '../../../../common/components/tables/filterrows';
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
    FloatDialog
],
    template: `
        <app-floattable [values]="allItems" stateKey="cor-birds-session" [isLoading]="isLoading" [showAdd]="canWrite" (onAddItem)="showAddItem()" (onLoadItems)="loadItems()" (onShowItem)="showEditItem($event)" [interface]="this" [showContextMenu]="true" [showImport]="true">
            <ng-template #tableHeader>
                <th textfiltercolumn pSortableColumn="name" displayName="Name"></th>
                <th datefiltercolumn pSortableColumn="createdAt" displayName="Created At"></th>
                <th datefiltercolumn pSortableColumn="updatedAt" displayName="Updated At"></th>
            </ng-template>
            <ng-template #tableRows let-item>
                <td tagrow [value]="item.name"></td>
                <td daterow [value]="item.createdAt"></td>
                <td daterow [value]="item.updatedAt"></td>
            </ng-template>
        </app-floattable>

        <app-floatdialog [currentItem]="currentItem" [(showDialog)]="showDialog" (onSaveItem)="saveItem()" (onDeleteItem)="deleteItem()" [canWrite]="canWrite" [style]="{'width':'80vw','height':'80vh'}">
            <ng-template #body>
                <div class="flex flex-col gap-2 w-full h-full">

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
            icon: '',
            birthDate: ''
        } as BirdModel;
    }

    override getAllEndpoint: string = Endpoints.COR.Birds.Get_AllBirds;
    override getEndpoint: string = Endpoints.COR.Birds.Get_Bird;
    override patchEndpoint: string = Endpoints.COR.Birds.Patch_UpdateBird;
    override postEndpoint: string = Endpoints.COR.Birds.Post_AddBird;
    override deleteEndpoint: string = Endpoints.COR.Birds.Delete_Bird;
}
