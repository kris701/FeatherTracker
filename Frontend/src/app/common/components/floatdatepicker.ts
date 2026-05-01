import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'app-floatdatepicker',
    imports: [FormsModule, CommonModule, FloatLabelModule, DatePickerModule, InputIconModule, IconFieldModule, InputGroup, InputGroupAddon],
    template: `
        <p-inputgroup style="height:2.5rem">
            @if (icon != '') {
                <p-inputgroup-addon>
                    <i class="pi {{ icon }}"></i>
                </p-inputgroup-addon>
            }
            <p-floatlabel variant="on">
                <p-datepicker
                    panelStyleClass="raiseround"
                    [(ngModel)]="value"
                    [ngClass]="{ 'ng-invalid ng-dirty': !isValid }"
                    [showIcon]="false"
                    [firstDayOfWeek]="1"
                    [showTime]="showTime"
                    [showClear]="false"
                    hourFormat="24"
                    dateFormat="yy/mm/dd"
                    [disabled]="disabled"
                    inputId="datepickerlabel"
                    fluid
                    appendTo="body"
                    (ngModelChange)="valueChanged()"
                    style="border-radius: var(-p-datepicker-border)"
                    [inputStyle]="{ 'border-radius': 'inherit' }"
                    [minDate]="min"
                    [maxDate]="max"
                />
                <label for="datepickerlabel">{{ label }}</label>
            </p-floatlabel>
        </p-inputgroup>
    `
})
export class FloatDatePicker implements OnChanges {
    @Input() disabled: boolean = false;
    @Input() showClear: boolean = false;
    @Input() showTime: boolean = false;

    @Input() icon: string = '';
    @Input() label: string = '';
    @Input() value: string | Date | null = null;
    @Output() valueChange = new EventEmitter<string | Date | null>();

    @Input() min: Date | null = null;
    @Input() max: Date | null = null;

    isValid: boolean = true;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value']) {
            if (changes['value'].currentValue != changes['value'].previousValue) {
                this.value = changes['value'].currentValue;
                this.valueChanged();
            }
        }
    }

    valueChanged() {
        this.isValid = this.value != undefined && this.value != null && this.value != '';
        this.valueChange.emit(this.value);
    }
}
