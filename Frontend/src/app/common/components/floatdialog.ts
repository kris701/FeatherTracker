import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CreatedUpdatedControl } from './createdupdatedcontrol';

@Component({
    selector: 'app-floatdialog',
    imports: [FormsModule, CommonModule, DialogModule, ButtonModule, FloatLabelModule, InputTextModule, MultiSelectModule, PasswordModule, EditorModule, TagModule, TableModule, CreatedUpdatedControl],
    template: `
        <p-dialog [(visible)]="showDialog" [breakpoints]="{ '960px': '95vw' }" modal maximizable [draggable]="false" (onHide)="showDialogChange.emit(showDialog)" (onShow)="showDialogChange.emit(showDialog)" [style]="style">
            @if (currentItem && showDialog) {
                <ng-template #header>
                    <div class="inline-flex items-center justify-center gap-2">
                        @if (headerField in currentItem && headerStr == undefined) {
                            <span class="font-bold whitespace-nowrap">{{ currentItem[headerField] }}</span>
                        } @else if (headerStr) {
                            <span class="font-bold whitespace-nowrap">{{ headerStr }}</span>
                        }
                        <app-createdupdated [createdAt]="currentItem.createdAt" [updatedAt]="currentItem.updatedAt" />
                    </div>
                </ng-template>
                <div class="flex flex-col gap-2 pt-2 flex-grow h-full">
                    <ng-container [ngTemplateOutlet]="body"></ng-container>
                </div>
                <ng-template #footer>
                    <div class="flex flex-row gap-4 items-center" style="min-height:3rem">
                        <p-button label="Save" icon="pi pi-save" (click)="onSaveItem.emit()" [hidden]="!canWrite || !showSave" />
                        <p-button icon="pi pi-times" label="Delete" severity="danger" (click)="onDeleteItem.emit(currentItem.id)" [hidden]="!canWrite || currentItem.id == ''"></p-button>
                    </div>
                </ng-template>
            }
        </p-dialog>
    `,
    styles: `
        ::ng-deep.p-dialog-content {
            height: 100%;
        }

    `
})
export class FloatDialog {
    @ContentChild('body', { static: false }) body: TemplateRef<any> | undefined;

    @Input() style : any;

    @Output() onSaveItem: EventEmitter<any> = new EventEmitter();
    @Output() onDeleteItem: EventEmitter<any> = new EventEmitter();
    @Output() onGenerateQueryRef: EventEmitter<any> = new EventEmitter();

    @Input() headerField: string = 'name';
    @Input() headerStr: string | undefined;

    @Input() currentItem: any | undefined;

    @Input() showDialog: boolean = false;
    @Output() showDialogChange = new EventEmitter<boolean>();

    @Input() canWrite: boolean = true;

    @Input() showSave: boolean = true;
}
