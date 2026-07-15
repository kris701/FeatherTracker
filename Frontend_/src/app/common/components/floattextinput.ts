import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiInput } from '@taiga-ui/core';

@Component({
    selector: 'app-floattextinput',
    imports: [
		FormsModule,
		CommonModule,
		TuiInput
	],
    template: `
		<tui-textfield [tuiTextfieldSize]="size" [iconStart]="icon">
			@if(label){
				<label tuiLabel>{{label}}</label>
			}
			<input tuiInput [(ngModel)]="value" (ngModelChange)="valueChange.emit(value)" [disabled]="disabled"/>
		</tui-textfield>
    `,
    styles: `
    `
})
export class FloatTextInput implements OnChanges {
    @Input() icon: string = '';
    @Input() label: string = '';

	@Input() size: "l" | "m" | "s" = 'm';

    @Input() disabled: boolean = false;

    @Input() value: number | string = "";
    @Output() valueChange = new EventEmitter<number | string>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value'] && changes['value'].currentValue != changes['value'].previousValue) {
            this.value = changes['value'].currentValue;
        }
    }
}
