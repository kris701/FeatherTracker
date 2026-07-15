import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiIcon, TuiInput } from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';

@Component({
    selector: 'app-floatpasswordinput',
    imports: [
		FormsModule,
		CommonModule,
		TuiInput,
		TuiIcon,
		TuiPassword
	],
    template: `
		<tui-textfield [tuiTextfieldSize]="size" [iconStart]="icon">
			@if(label){
				<label tuiLabel>{{label}}</label>
			}
			<input tuiInput type="password" [(ngModel)]="value" (ngModelChange)="valueChange.emit(value)" [disabled]="disabled"/>
			<tui-icon tuiPassword />
		</tui-textfield>
    `,
    styles: `
    `
})
export class FloatPasswordInput implements OnChanges {
    @Input() icon: string = '';
    @Input() label: string = '';

	@Input() size: "l" | "m" | "s" = 'm';

    @Input() disabled: boolean = false;

    @Input() value: string = "";
    @Output() valueChange = new EventEmitter<string>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value'] && changes['value'].currentValue != changes['value'].previousValue) {
            this.value = changes['value'].currentValue;
        }
    }
}
