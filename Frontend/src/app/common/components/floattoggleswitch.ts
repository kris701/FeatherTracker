import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-floattoggleswitch',
    imports: [FormsModule, CommonModule, ToggleSwitchModule, FloatLabelModule, InputGroupModule, InputGroupAddonModule],
    template: `
        <p-inputgroup style="height:2.5rem">
            @if (icon != '') {
                <p-inputgroup-addon>
                    <i class="pi {{ icon }}"></i>
                </p-inputgroup-addon>
            }
            <div
                class="w-full flex flex-row cursor-pointer pl-4 pr-2 floattoggleswitch-label"
                [ngClass]="icon == '' ? 'floattoggleswitch-label-noicon' : ''"
                (click)="value = !value; checkChanged()"
            >
                <p class="cursor-pointer" [ngClass]="disabled ? 'text-surface-500' : ''" style="white-space:pre">{{ label }}</p>
            </div>
            <p-inputgroup-addon>
                <p-toggleswitch [(ngModel)]="value" [style]="{ 'min-width': 'var(--p-toggleswitch-width)' }" [disabled]="disabled" class="h-full ml-2 mr-2" [hidden]="hidden" (click)="checkChanged()" />
            </p-inputgroup-addon>
        </p-inputgroup>
    `,
    styles : `
    .floattoggleswitch-label {
        justify-content:left;
        align-self:normal;
        align-items:center;
        border:1px solid var(--p-select-border-color);
        overflow:hidden;
        background:var(--p-inputgroup-addon-background);
    }

    .floattoggleswitch-label-noicon {
        border-top-left-radius: var(--p-inputgroup-addon-border-radius);
        border-bottom-left-radius: var(--p-inputgroup-addon-border-radius);
    }
    `
})
export class FloatToggleSwitch implements OnChanges {
    @Input() disabled: boolean = false;
    @Input() hidden: boolean = false;

    @Input() icon: string = '';
    @Input() label: string = '';

    @Input() value: boolean | undefined = undefined;
    @Output() valueChange = new EventEmitter<boolean | undefined>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value'] && changes['value'].currentValue != changes['value'].previousValue) {
            this.value = changes['value'].currentValue;
        }
    }

    checkChanged() {
        this.valueChange.emit(this.value);
    }
}
