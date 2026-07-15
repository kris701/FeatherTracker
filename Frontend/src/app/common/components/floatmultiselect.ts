import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiDataList, TuiDropdown, TuiSelectLike, TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiInputChip, TuiInputNumber, TuiMultiSelect } from '@taiga-ui/kit';

@Component({
    selector: 'app-floatmultiselect',
    imports: [
		FormsModule,
		CommonModule,
		TuiMultiSelect,
		TuiInputNumber,
		TuiDataList,
		TuiTextfield,
		TuiInputChip,
		TuiSelectLike,
		TuiMultiSelect,
		TuiDropdown,
		TuiChevron
	],
    template: `
		<tui-textfield multi tuiChevron [stringify]="stringify" [tuiTextfieldSize]="size" [iconStart]="icon">
			@if(label != ''){
				<label tuiLabel>{{label}}</label>
			}
			<input tuiInputChip tuiSelectLike [(ngModel)]="selected" (ngModelChange)="selectedChange.emit(this.selected)"/>
			<tui-input-chip *tuiItem />
			<tui-data-list *tuiDropdown tuiMultiSelectGroup >
				@for (item of options; track getOptionValue(item)) {
					<button tuiOption [value]="getOptionValue(item)">
						{{ getOptionLabel(item) }}
					</button>
				}
			</tui-data-list>
		</tui-textfield>
    `,
    styles: `
    `
})
export class FloatMultiSelect implements OnChanges {
    @Input() icon: string = '';
    @Input() label: string = '';

	@Input() size: "l" | "m" | "s" = 'm';

    @Input() optionLabel: string | undefined = undefined;
    @Input() optionValue: string | undefined = undefined;

    @Input() options: any[] = [];
    @Input() disabled: boolean = false;

    @Input() selected: any[] | null | undefined = undefined;
    @Output() selectedChange = new EventEmitter<any[] | null | undefined>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selected'] && changes['selected'].currentValue != changes['selected'].previousValue) {
            this.selected = changes['selected'].currentValue;
        }
    }

	stringify = (value: string): string => this.getOptionLabel(this.options.find((item) => this.getOptionValue(item) === value));

    getOptionLabel(item: any) {
		if (!item)
			return "";
        if (this.optionLabel == undefined || this.optionLabel == '') return item;
        return item[this.optionLabel];
    }

    getOptionValue(item: any) {
		if (!item)
			return "";
        if (this.optionValue == undefined || this.optionValue == '') return item;
        return item[this.optionValue];
    }
}
