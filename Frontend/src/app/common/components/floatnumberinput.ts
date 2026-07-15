import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiInput } from '@taiga-ui/core';
import { TuiInputNumber } from '@taiga-ui/kit';

@Component({
    selector: 'app-floatnumberinput',
    imports: [
		FormsModule,
		CommonModule,
		TuiInput,
		TuiInputNumber
	],
    template: `
		<tui-textfield [tuiTextfieldSize]="size" [iconStart]="icon">
			@if(label){
				<label tuiLabel>{{label}}</label>
			}
			<input tuiInputNumber [(ngModel)]="value" (ngModelChange)="valueChange.emit(value)" [disabled]="disabled" [min]="min" [max]="max"/>
		</tui-textfield>
    `,
    styles: `
    `
})
export class FloatNumberInput implements OnChanges {
    @Input() icon: string = '';
    @Input() label: string = '';

	@Input() size: "l" | "m" | "s" = 'm';

    @Input() disabled: boolean = false;

	@Input() min : number | null = null;
	@Input() max : number | null = null;

    @Input() value: number | string = "";
    @Output() valueChange = new EventEmitter<number | string>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value'] && changes['value'].currentValue != changes['value'].previousValue) {
            this.value = changes['value'].currentValue;
        }
    }
}
