import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiDropdown, TuiGroup, TuiOption } from '@taiga-ui/core';
import { TuiChevron } from '@taiga-ui/kit';

export interface MenuBarItem {
	label: string | null;
	icon: string | null;
	items : MenuBarItem[];
	disabled: boolean;
	expanded: boolean;
	command() : Promise<any>;
}

@Component({
    selector: 'tui-data-list[subdatalist]',
    standalone: true,
    imports: [
        TuiDropdown,
		TuiOption,
        TuiChevron
    ],
    template: `
		@for(item of subdatalist; track $index){
			@if(item.items){
				<button
					tuiOption
					tuiChevron
					[iconStart]="item.icon"
					[disabled]="item.disabled"
					[tuiDropdown]="dropdownContent"
					[(tuiDropdownOpen)]="item.expanded"
					tuiDropdownLimitWidth="fixed"
					tuiDropdownSided="true"
				>
				{{item.label}}
				</button>

				<ng-template #dropdownContent>
					<tui-data-list
						class="subdatalist"
						[subdatalist]="item.items">
					</tui-data-list>
				</ng-template>
			}
			@else {
				<button
					tuiOption
					[iconStart]="item.icon"
					[disabled]="item.disabled"
					(click)="item.command()"
				>
					{{item.label}}
				</button>
			}
		}
    `,
	styles: `
		.subdatalist {
			display:flex;
			flex-direction: column;
		}

		button::after {

		}
	`
})
export class FloatMenuBarSubDataList {
    @Input() subdatalist: MenuBarItem[] = [];
}

@Component({
    selector: 'app-floatmenubar',
	standalone: true,
    imports: [
		FormsModule,
		CommonModule,
		TuiGroup,
		TuiButton,
		TuiDropdown,
		TuiChevron,
		FloatMenuBarSubDataList
	],
    template: `
		<div tuiGroup class="group" [collapsed]="true">
			@for(item of items; track $index){
				@if(item.items){
					<button
						tuiButton
						tuiChevron
						size="s"
						appearance="outline"
						type="button"
						[iconStart]="item.icon"
						[disabled]="item.disabled"
						[tuiDropdown]="dropdownContent"
						[(tuiDropdownOpen)]="item.expanded"
						tuiDropdownLimitWidth="fixed"
					>
						{{item.label}}
					</button>

					<ng-template #dropdownContent>
						<tui-data-list
							class="subdatalist"
							[subdatalist]="item.items">
						</tui-data-list>
					</ng-template>
				}
				@else {
					<button
						appearance="outline"
						size="s"
						tuiButton
						type="button"
						[iconStart]="item.icon"
						[disabled]="item.disabled"
						(click)="item.command()"
					>
						{{item.label}}
					</button>
				}
			}
		</div>
    `,
    styles: `
		.group {
			width:100%;
			white-space: nowrap;
		}

		.subdatalist {
			display:flex;
			flex-direction: column;
		}
    `
})
export class FloatMenuBar implements OnChanges {
    @Input() items: MenuBarItem[] = [];

	ngOnChanges(changes: SimpleChanges) {
        if (changes['items'] && changes['items'].currentValue != changes['items'].previousValue) {
            this.items = changes['items'].currentValue;
        }
    }
}
