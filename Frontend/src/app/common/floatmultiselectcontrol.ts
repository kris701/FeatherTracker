import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'app-floatmultiselect',
    imports: [FormsModule, CommonModule, ButtonModule, DrawerModule, TableModule, TagModule, MultiSelectModule, InputIconModule, IconFieldModule, FloatLabelModule, ChipModule],
    template: `
        <p-floatlabel variant="on">
            <p-iconfield>
                <p-inputicon styleClass="pi {{ icon }}" *ngIf="icon != ''" style="z-index:1" />
                <p-multiselect
                    id="floatmultiselectlabel"
                    [options]="options"
                    [disabled]="disabled"
                    [(ngModel)]="selected"
                    display="chip"
                    [filter]="true"
                    [showClear]="showClear"
                    [filterBy]="optionValue + ',' + optionLabel"
                    (onChange)="selectionChanged()"
                    fluid
                    appendTo="body"
                    [optionLabel]="optionLabel"
                    [optionValue]="optionValue"
                >
                    <ng-template let-items pTemplate="selectedItems">
                        <div class="pr-6" *ngIf="icon != ''"></div>
                        <div *ngFor="let item of items">
                            <p-tag [severity]="getSeverity(item)"> {{ getOptionLabel(item) }}</p-tag>
                        </div>
                    </ng-template>
                    <ng-template let-item pTemplate="item">
                        <p-tag [severity]="getSeverity(item)"> {{ getOptionLabel(item) }}</p-tag>
                    </ng-template>
                </p-multiselect>
            </p-iconfield>
            <label for="floatmultiselectlabel">{{ label }}</label>
        </p-floatlabel>
    `
})
export class FloatMultiSelectControl implements OnChanges {
    @Input() showClear: boolean = false;
    @Input() options: any[] = [];
    @Input() disabled: boolean = false;

    @Input() icon: string = '';
    @Input() label: string = '';

    @Input() severityMap: { [value: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined } | undefined = undefined;
    @Input() severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined = 'secondary';

    @Input() optionLabel: string = '';
    @Input() optionValue: string = '';

    @Input() selected: any[] | null | undefined = undefined;
    @Output() selectedChange = new EventEmitter<any[] | null | undefined>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selected'] && changes['selected'].currentValue != changes['selected'].previousValue) {
            this.selected = changes['selected'].currentValue;
        }
    }

    getSeverity(item: any): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (this.severityMap == undefined) return this.severity;
        var target = this.severityMap[this.getOptionValue(item)];
        if (target) return target;
        return 'secondary';
    }

    getOptionLabel(item: any) {
        if (this.optionLabel == null || this.optionLabel == '') return item;
        return item[this.optionLabel];
    }

    getOptionValue(item: any) {
        if (this.optionValue == null || this.optionValue == '') return item;
        return item[this.optionValue];
    }

    selectionChanged() {
        this.selectedChange.emit(this.selected);
    }
}
