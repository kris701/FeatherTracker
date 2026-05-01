import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-floatpasswordinput',
    imports: [FormsModule, CommonModule, FloatLabelModule, InputTextModule, InputIconModule, IconFieldModule, PasswordModule, InputGroup, InputGroupAddon],
    template: `
        <p-inputgroup style="height:2.5rem">
            @if (icon != '') {
                <p-inputgroup-addon>
                    <i class="pi {{ icon }}"></i>
                </p-inputgroup-addon>
            }
            <p-floatlabel variant="on">
                <p-password
                    panelStyleClass="raiseround"
                    [ngClass]="isValid ? '' : 'ng-invalid ng-dirty'"
                    [inputId]="id"
                    [feedback]="feedback"
                    [toggleMask]="true"
                    type="text"
                    [(ngModel)]="value"
                    [disabled]="disabled"
                    fluid
                    (change)="valueChanged()"
                    (keyup.enter)="onEnter.emit()"
                    appendTo="body"
                    style="border-radius: var(-p-password-border)"
                    [inputStyle]="{ 'border-radius': 'inherit' }"
                />
                <label [for]="id">{{ label }}</label>
            </p-floatlabel>
        </p-inputgroup>
    `
})
export class FloatPasswordInput implements OnChanges {
    @Input() disabled: boolean = false;
    @Input() feedback: boolean = false;

    @Input() icon: string = '';
    @Input() label: string = '';
    @Input() value: string | null | undefined = undefined;
    @Output() valueChange = new EventEmitter<string | null | undefined>();
    @Output() onEnter = new EventEmitter<null>();

    @Input() id: string = crypto.randomUUID();

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
        if (this.value) this.value = this.value.trim();
        this.isValid = this.value != undefined && this.value != null && this.value != '';
        this.valueChange.emit(this.value);
    }
}
