import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'th[textfiltercolumn]',
    imports: [CommonModule, TableModule],
    template: `
        <div class="flex items-center">
            {{ displayName }}
            <p-columnFilter type="text" [field]="pSortableColumn" display="menu" *ngIf="pSortableColumn != null" />
            <p-sortIcon [field]="pSortableColumn" *ngIf="pSortableColumn != null" />
        </div>
    `
})
export class TableTextFilterColumn {
    @Input() pSortableColumn: string | undefined = '';
    @Input() displayName: string | null = '';
}

@Component({
    selector: 'th[datefiltercolumn]',
    imports: [CommonModule, TableModule],
    template: `
        <div class="flex items-center">
            {{ displayName }}
            <p-columnFilter type="date" [field]="pSortableColumn" display="menu" *ngIf="pSortableColumn != null" />
            <p-sortIcon [field]="pSortableColumn" *ngIf="pSortableColumn != null" />
        </div>
    `
})
export class TableDateFilterColumn {
    @Input() pSortableColumn: string | undefined = '';
    @Input() displayName: string | null = '';
}

@Component({
    selector: 'th[boolfiltercolumn]',
    imports: [CommonModule, TableModule],
    template: `
        <div class="flex items-center">
            {{ displayName }}
            <p-columnFilter type="boolean" [field]="pSortableColumn" display="menu" *ngIf="pSortableColumn != null" />
            <p-sortIcon [field]="pSortableColumn" *ngIf="pSortableColumn != null" />
        </div>
    `
})
export class TableBoolFilterColumn {
    @Input() pSortableColumn: string | undefined = '';
    @Input() displayName: string | null = '';
}

@Component({
    selector: 'th[numericfiltercolumn]',
    imports: [CommonModule, TableModule],
    template: `
        <div class="flex items-center">
            {{ displayName }}
            <p-columnFilter type="numeric" [field]="pSortableColumn" display="menu" *ngIf="pSortableColumn != null" />
            <p-sortIcon [field]="pSortableColumn" *ngIf="pSortableColumn != null" />
        </div>
    `
})
export class TableNumericFilterColumn {
    @Input() pSortableColumn: string | undefined = '';
    @Input() displayName: string | null = '';
}

@Component({
    selector: 'th[selectfiltercolumn]',
    imports: [CommonModule, FormsModule, TableModule, SelectModule, TagModule],
    template: `
        <div class="flex items-center">
            {{ displayName }}
            <p-columnFilter [field]="pSortableColumn" matchMode="equals" display="menu">
                <ng-template #filter let-value let-filter="filterCallback">
                    <p-select [ngModel]="value" [options]="options" (onChange)="filter($event.value)" placeholder="Any" fluid [optionLabel]="optionLabel" [optionValue]="optionValue"> </p-select>
                </ng-template>
            </p-columnFilter>
            <p-sortIcon [field]="pSortableColumn" />
        </div>
    `
})
export class TableSelectFilterColumn {
    @Input() pSortableColumn: string | undefined = '';
    @Input() displayName: string | null = '';
    @Input() options: any[] = [];
    @Input() optionLabel: string | undefined = 'name';
    @Input() optionValue: string | undefined = 'id';
}

@Component({
    selector: 'th[selecttagfiltercolumn]',
    imports: [CommonModule, FormsModule, TableModule, SelectModule, TagModule],
    template: `
        <div class="flex items-center">
            {{ displayName }}
            <p-columnFilter [field]="pSortableColumn" matchMode="equals" display="menu">
                <ng-template #filter let-value let-filter="filterCallback">
                    <p-select [ngModel]="value" [options]="options" (onChange)="filter($event.value)" placeholder="Any" fluid [optionLabel]="optionLabel" [optionValue]="optionValue">
                        <ng-template let-option #item>
                            @if (severityMap) {
                                <p-tag [severity]="getOptionValue(option) ? severityMap![getOptionValue(option)] : 'secondary'">{{ getOptionLabel(option) }}</p-tag>
                            } @else {
                                <p-tag severity="secondary">{{ getOptionLabel(option) }}</p-tag>
                            }
                        </ng-template>
                    </p-select>
                </ng-template>
            </p-columnFilter>
            <p-sortIcon [field]="pSortableColumn" />
        </div>
    `
})
export class TableSelectTagFilterColumn {
    @Input() pSortableColumn: string | undefined = '';
    @Input() displayName: string | null = '';
    @Input() options: any[] = [];
    @Input() severityMap: { [value: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined } | undefined = undefined;
    @Input() optionLabel: string = 'label';
    @Input() optionValue: string = 'value';

    getOptionLabel(item: any) {
        if (this.optionLabel == null || this.optionLabel == '') return item;
        return item[this.optionLabel];
    }

    getOptionValue(item: any) {
        if (this.optionValue == null || this.optionValue == '') return item;
        return item[this.optionValue];
    }
}

@Component({
    selector: 'th[multiselectfiltercolumn]',
    imports: [CommonModule, FormsModule, TableModule, MultiSelectModule, TagModule],
    template: `
        <div class="flex items-center">
            {{ displayName }}
            <p-columnFilter [field]="pSortableColumn" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                <ng-template #filter let-value let-filter="filterCallback">
                    <p-multiSelect [ngModel]="value" [options]="options" placeholder="Any" (onChange)="filter($event.value)" [optionValue]="optionValue" [optionLabel]="optionLabel" fluid> </p-multiSelect>
                </ng-template>
            </p-columnFilter>
            <p-sortIcon [field]="pSortableColumn" />
        </div>
    `
})
export class TableMultiSelectFilterColumn {
    @Input() pSortableColumn: string | undefined = '';
    @Input() displayName: string | null = '';
    @Input() options: any[] = [];
    @Input() optionLabel: string = 'name';
    @Input() optionValue: string = 'id';
}
