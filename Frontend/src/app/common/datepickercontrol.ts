import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
    selector: 'app-datepicker',
    imports: [FormsModule, CommonModule, FloatLabelModule, DatePickerModule, InputIconModule, IconFieldModule],
    template: `
        <p-floatlabel variant="on">
            <p-iconfield>
                <p-inputicon styleClass="pi {{ icon }}" *ngIf="icon != ''" style="z-index:1" />
                <p-datepicker
                    [(ngModel)]="value"
                    [ngClass]="{ 'ng-invalid ng-dirty': !isValid, inputOffsetter: icon != '' }"
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
                />
                <p-inputicon styleClass="pi pi-times" class="cursor-pointer" *ngIf="showClear && value != null" style="z-index:1" (click)="value = null; valueChanged()" />
            </p-iconfield>
            <label for="datepickerlabel">{{ label }}</label>
        </p-floatlabel>
    `
})
export class DatePickerControl implements OnChanges {
    @Input() disabled: boolean = false;
    @Input() showClear: boolean = false;
    @Input() showTime: boolean = false;

    @Input() icon: string = '';
    @Input() label: string = '';
    @Input() value: string | Date | null = null;
    @Output() valueChange = new EventEmitter<string | Date | null>();

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
