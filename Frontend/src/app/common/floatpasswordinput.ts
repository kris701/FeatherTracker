import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-floatpasswordinput',
    imports: [FormsModule, CommonModule, FloatLabelModule, InputTextModule, InputIconModule, IconFieldModule, PasswordModule],
    template: `
        <p-floatlabel variant="on">
            <p-iconfield>
                <p-inputicon styleClass="pi {{ icon }}" *ngIf="icon != ''" />
                <p-password [ngClass]="isValid ? '' : 'ng-invalid ng-dirty'" id="floatpasswordlabel" [feedback]="feedback" [toggleMask]="true" type="text" [(ngModel)]="value" [disabled]="disabled" fluid (change)="valueChanged()" />
            </p-iconfield>
            <label for="floatpasswordlabel">{{ label }}</label>
        </p-floatlabel>
    `
})
export class FloatPasswordInput implements OnChanges {
    @Input() disabled: boolean = false;
    @Input() feedback: boolean = false;

    @Input() icon: string = '';
    @Input() label: string = '';
    @Input() value: string | null | undefined = undefined;
    @Output() valueChange = new EventEmitter<string | null | undefined>();

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
