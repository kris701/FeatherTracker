import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
    selector: 'app-floatnumberinput',
    imports: [FormsModule, CommonModule, FloatLabelModule, InputTextModule, InputNumberModule, InputIconModule, IconFieldModule],
    template: `
        <p-floatlabel variant="on">
            <p-iconfield>
                <p-inputicon styleClass="pi {{ icon }}" *ngIf="icon != ''" style="z-index:1" />
                <p-inputnumber
                    [ngClass]="{ 'ng-invalid ng-dirty': !isValid, inputOffsetter: icon != '' }"
                    [(ngModel)]="value"
                    [currency]="currency"
                    inputId="floatnumberlabel"
                    [mode]="mode"
                    [min]="min"
                    [max]="max"
                    [disabled]="disabled"
                    fluid
                    (ngModelChange)="valueChanged()"
                />
            </p-iconfield>
            <label for="floatnumberlabel">{{ label }}</label>
        </p-floatlabel>
    `
})
export class FloatNumberInput implements OnChanges {
    @Input() disabled: boolean = false;

    @Input() min: number = 0;
    @Input() max: number = 99999999999;

    @Input() icon: string = '';
    @Input() label: string = '';
    @Input() mode: string = 'decimal';
    @Input() currency: string = 'USD';
    @Input() value: number | null | undefined = undefined;
    @Output() valueChange = new EventEmitter<number | null | undefined>();

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
        this.isValid = this.value != undefined && this.value != null;
        this.valueChange.emit(this.value);
    }
}
