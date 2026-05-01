import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-floattextinput',
    imports: [FormsModule, CommonModule, FloatLabelModule, InputTextModule, InputIconModule, IconFieldModule, AutoFocusModule, InputGroupModule, InputGroupAddonModule],
    template: `
        <p-inputgroup style="height:2.5rem">
            @if (icon != '') {
                <p-inputgroup-addon>
                    <i class="pi {{ icon }}"></i>
                </p-inputgroup-addon>
            }
            <p-floatlabel variant="on">
                @if (size == 'normal') {
                    <input
                        pInputText
                        [ngClass]="isValid ? '' : 'ng-invalid ng-dirty'"
                        [id]="id"
                        type="text"
                        [(ngModel)]="value"
                        [disabled]="disabled"
                        fluid
                        (change)="valueChanged()"
                        (blur)="onBlur()"
                        (keyup.enter)="onEnter.emit()"
                        autofocus
                        [pAutoFocus]="autoFocus"
                    />
                } @else if (size == 'small' || size == 'large') {
                    <input
                        pInputText
                        [pSize]="size"
                        [ngClass]="isValid ? '' : 'ng-invalid ng-dirty'"
                        [id]="id"
                        type="text"
                        [(ngModel)]="value"
                        [disabled]="disabled"
                        fluid
                        (change)="valueChanged()"
                        (blur)="onBlur()"
                        (keyup.enter)="onEnter.emit()"
                        autofocus
                        [pAutoFocus]="autoFocus"
                    />
                }
                <label [for]="id">{{ label }}</label>
            </p-floatlabel>
        </p-inputgroup>
    `
})
export class FloatTextInput implements OnChanges {
    @Input() disabled: boolean = false;
    @Input() autoFocus: boolean = false;
    @Input() size: 'normal' | 'small' | 'large' = 'normal';

    @Input() icon: string = '';
    @Input() label: string = '';
    @Input() value: string | null | undefined = undefined;
    @Output() valueChange = new EventEmitter<string | null | undefined>();
    @Output() blur = new EventEmitter<null>();
    @Output() onEnter = new EventEmitter<null>();

    isValid: boolean = true;

    @Input() id: string = crypto.randomUUID();

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

    onBlur() {
        this.blur.emit();
    }

    focus(){
        var item = document.getElementById(this.id);
        item?.focus();
    }
}
