import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DrawerModule } from 'primeng/drawer';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-floatselect',
    imports: [FormsModule, CommonModule, ButtonModule, DrawerModule, TableModule, TagModule, SelectModule, InputIconModule, IconFieldModule, FloatLabelModule, ChipModule, InputGroupAddon, InputGroup],
    template: `
        <p-inputgroup style="height:2.5rem">
            @if (icon != '') {
                <p-inputgroup-addon>
                    <i class="pi {{ icon }}"></i>
                </p-inputgroup-addon>
            }
            <p-floatlabel variant="on">
                <p-select
                    [inputId]="id"
                    [options]="options"
                    [optionLabel]="optionLabel"
                    [optionValue]="optionValue"
                    [editable]="editable"
                    [disabled]="disabled"
                    [filterFields]="[optionValue, optionLabel]"
                    [(ngModel)]="selected"
                    display="chip"
                    [filter]="true"
                    [showClear]="showClear"
                    (onChange)="selectionChanged()"
                    fluid
                    appendTo="body"
                    (onBlur)="onBlur()"
                    panelStyleClass="raiseround"
                    style="border-radius: var(-p-select-border)"
                >
                    <ng-template let-item pTemplate="selectedItem">
                        <p-tag [severity]="getSeverity(item)">{{ getOptionLabel(item) }}</p-tag>
                    </ng-template>
                    <ng-template let-item pTemplate="item">
                        <p-tag [severity]="getSeverity(item)"> {{ getOptionLabel(item) }}</p-tag>
                    </ng-template>
                </p-select>
                <label [for]="id">{{ label }}</label>
            </p-floatlabel>
        </p-inputgroup>
    `
})
export class FloatSelect implements OnChanges {
    @Input() showClear: boolean = false;
    @Input() options: any[] = [];
    @Input() disabled: boolean = false;

    @Input() editable: boolean = false;

    @Input() icon: string = '';
    @Input() label: string = '';

    @Input() severityMap: { [value: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined } | undefined = undefined;
    @Input() severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined = 'secondary';

    @Input() optionLabel: string | undefined = undefined;
    @Input() optionValue: string | undefined = undefined;

    @Input() selected: any | null | undefined = undefined;
    @Output() selectedChange = new EventEmitter<any | null | undefined>();

    @Output() blur = new EventEmitter<null>();

    @Input() id: string = crypto.randomUUID();

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
        if (this.optionLabel == undefined || this.optionLabel == '') return item;
        return item[this.optionLabel];
    }

    getOptionValue(item: any) {
        if (this.optionValue == undefined || this.optionValue == '') return item;
        return item[this.optionValue];
    }

    selectionChanged() {
        this.selectedChange.emit(this.selected);
    }

    onBlur() {
        this.blur.emit();
    }
}
