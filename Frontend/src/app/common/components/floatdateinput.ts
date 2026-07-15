import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk/date-time';
import { TuiInput } from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';

@Component({
    selector: 'app-floatdateinput',
    imports: [
		FormsModule,
		CommonModule,
		TuiInput,
		TuiInputDate
	],
    template: `
		<tui-textfield [tuiTextfieldSize]="size" [iconStart]="icon">
			@if(label){
				<label tuiLabel>{{label}}</label>
			}
			<input tuiInputDate [(ngModel)]="internalValue" (ngModelChange)="updateValue()" [disabled]="disabled" [min]="min ? TuiDay.fromLocalNativeDate(min) : null" [max]="max ? TuiDay.fromLocalNativeDate(max) : null"/>
			<tui-calendar *tuiDropdown />
		</tui-textfield>
    `,
    styles: `
    `
})
export class FloatDateInput implements OnChanges {
    @Input() icon: string = '';
    @Input() label: string = '';

	@Input() size: "l" | "m" | "s" = 'm';

    @Input() disabled: boolean = false;

	@Input() min : Date | null = null;
	@Input() max : Date | null = null;

	TuiDay = TuiDay;

    @Input() value: Date | string = new Date;
    @Output() valueChange = new EventEmitter<Date | string>();

	internalValue : TuiDay | null = null;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value'] && changes['value'].currentValue != changes['value'].previousValue) {
            this.value = changes['value'].currentValue;
			this.value = new Date(this.value);
			this.internalValue = TuiDay.fromUtcNativeDate(this.value);
        }
    }

	updateValue(){
		if (this.internalValue){
			this.value = this.internalValue?.toUtcNativeDate();
			this.valueChange.emit(this.value);
		}
	}
}
