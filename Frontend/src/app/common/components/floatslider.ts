import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SliderModule } from 'primeng/slider';

@Component({
    selector: 'app-floatslider',
    imports: [FormsModule, CommonModule, FloatLabelModule, InputGroupModule, InputGroupAddonModule, SliderModule],
    template: `
        <p-inputgroup style="height:2.5rem">
            @if (icon != '') {
                <p-inputgroup-addon>
                    <i class="pi {{ icon }}"></i>
                </p-inputgroup-addon>
            }
            <div class="w-full flex flex-row pl-4 pr-4" style="justify-content:left;align-self:normal;align-items:center;border:1px solid var(--p-select-border-color);overflow:hidden;background:var(--p-inputgroup-addon-background)">
                <p-slider [(ngModel)]="value" id="floatsliderlabel" [min]="min" [max]="max" [step]="step" class="w-full" (ngModelChange)="checkChanged()" />
            </div>
            <p-inputgroup-addon>
                <p>{{ value }}</p>
            </p-inputgroup-addon>
        </p-inputgroup>
    `
})
export class FloatSlider implements OnChanges {
    @Input() disabled: boolean = false;
    @Input() hidden: boolean = false;

    @Input() icon: string = '';

    @Input() min: number = 0;
    @Input() max: number = 1;
    @Input() step: number = 0.1;

    @Input() value: number = 0;
    @Output() valueChange = new EventEmitter<number>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value'] && changes['value'].currentValue != changes['value'].previousValue) {
            this.value = changes['value'].currentValue;
        }
    }

    checkChanged() {
        this.valueChange.emit(this.value);
    }
}
