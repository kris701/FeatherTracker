import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { getRandomInt } from '../helpers/randomhelper';

@Component({
    selector: 'app-floatnumberinput',
    imports: [FormsModule, CommonModule, FloatLabelModule, InputTextModule, InputNumberModule, InputIconModule, IconFieldModule, InputGroup, InputGroupAddon],
    template: `
        <p-inputgroup style="height:2.5rem">
            @if (icon != '') {
                <p-inputgroup-addon>
                    <i class="pi {{ icon }}"></i>
                </p-inputgroup-addon>
            }
            <p-floatlabel variant="on">
                <p-inputnumber
                    [ngClass]="{ 'ng-invalid ng-dirty': !isValid }"
                    [(ngModel)]="value"
                    [currency]="currency"
                    [inputId]="id"
                    locale="en-US"
                    [mode]="mode"
                    [min]="min"
                    [max]="max"
                    [disabled]="disabled"
                    fluid
                    (ngModelChange)="valueChanged()"
                    style="border-radius: var(-p-inputnumber-border)"
                    [inputStyle]="{ 'border-radius': 'inherit' }"
                />
                <label [for]="id">{{ label }}</label>
            </p-floatlabel>
        </p-inputgroup>
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

    @Input() id: string = getRandomInt(14);

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
