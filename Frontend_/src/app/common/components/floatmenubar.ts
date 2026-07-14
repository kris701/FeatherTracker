import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDropdown, TuiGroup } from '@taiga-ui/core';
import { TuiChevron, TuiDataListDropdownManager } from '@taiga-ui/kit';

@Component({
    selector: '[app-floatmenubar-expandablemenu]',
    imports: [
		FormsModule,
		CommonModule,
		TuiDataListDropdownManager,
		TuiDropdown,
		TuiDataList,
		TuiChevron
	],
    template: `
		@if(item){
			{{item.label}}

			<ng-template #content>
				<tui-data-list tuiDataListDropdownManager>
					@for(sub of item.items; track $index){
						@if(sub.items){
							<button
								app-floatmenubar-expandablemenu
								[item]="sub"
								tuiOption
								tuiChevron
								size="s"
								appearance="outline"
								type="button"
								[iconStart]="sub.icon"
								[disabled]="sub.disabled"
								tuiDropdown
								[(tuiDropdownOpen)]="sub.expanded"
							></button>
						}
						@else {
							<button
								appearance="outline"
								size="s"
								tuiOption
								[iconStart]="sub.icon"
								[disabled]="sub.disabled"
								(click)="sub.command()"
							>
								{{sub.label}}
							</button>
						}
					}
				</tui-data-list>
			</ng-template>
		}
    `,
	host: {
		'[attr.tuiDropdown]': 'templateRef'
	}
})
export class FloatMenuBarExpandableMenu implements OnChanges {
	@ViewChild("content") content : ElementRef<HTMLTemplateElement> | undefined;
	templateRef = viewChild<TemplateRef<unknown>>("content");

	@Input() item: MenuBarItem | null = null;

	ngOnChanges(changes: SimpleChanges) {
        if (changes['item'] && changes['item'].currentValue != changes['item'].previousValue) {
            this.item = changes['item'].currentValue;
        }
    }

	ngOnInit(){
		console.log(this.templateRef)
	}
}

@Component({
    selector: 'app-floatmenubar',
    imports: [
		FormsModule,
		CommonModule,
		TuiGroup,
		TuiButton,
		FloatMenuBarExpandableMenu,
		TuiChevron,
		TuiDropdown,
		TuiDataList,
	],
    template: `
		<div tuiGroup class="group" [collapsed]="true">
			@for(item of items; track $index){
				@if(item.items){
					<button
						app-floatmenubar-expandablemenu
						[item]="item"
						tuiButton
						tuiChevron
						size="s"
						appearance="outline"
						type="button"
						[iconStart]="item.icon"
						[disabled]="item.disabled"
						[tuiDropdown]="$templateRef"
						[tuiAppearanceState]="item.expanded ? 'hover' : null"
						[(tuiDropdownOpen)]="item.expanded"
					></button>
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

export interface MenuBarItem {
	label: string;
	icon: string | null;
	items : MenuBarItem[];
	disabled: boolean;
	expanded: boolean;
	command() : Promise<any>;
}
