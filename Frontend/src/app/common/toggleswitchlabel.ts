import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonChangeEvent } from 'primeng/togglebutton';

@Component({
    selector: 'app-toggleswitchlabel',
    imports: [FormsModule, CommonModule, ToggleSwitchModule],
    template: `
        <div class="card w-full flex flex-row gap-2 border border-surface" style="padding:7px;justify-content:center;align-self:normal;align-items:center;height:100%">
            <p-toggleswitch [(ngModel)]="value" [disabled]="disabled" class="flex" [hidden]="hidden" (ngModelChange)="checkChanged()" />
            <label [ngClass]="disabled ? 'text-surface-500' : ''">{{ label }}</label>
        </div>
    `
})
export class ToggleSwitchLabel implements OnChanges {
    @Input() disabled: boolean = false;
    @Input() hidden: boolean = false;

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
