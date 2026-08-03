import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EzUILayoutService } from '@kris701/ez-ui';
import { TuiButton } from '@taiga-ui/core';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, TuiButton],
    template: `
	<div class="app-topbar-container">
		<div class="flex flex-grow"></div>
		<div class="button-container">
			<button tuiButton size="m" appearance="flat" (click)="toggleDarkMode()" [iconStart]="layoutService.isDarkMode() ? 'moon' : 'sun'"></button>
		</div>
	</div>
	`,
	styles: `
		.app-topbar-container {
			display:flex;
			flex-direction: row;

			.button-container {
				display:flex;
				flex-direction: row;
				gap:10px;
				border-radius: 0 0 0 10px;
				padding:5px;
				background: var(--tui-background-elevation-2);
			}
		}
	`
})
export class AppTopbar {
    localStorage = localStorage;

    constructor(
        public layoutService: EzUILayoutService,
        public router: Router
    ) {}

    toggleDarkMode() {
        this.layoutService.ToggleDarkMode();
    }
}
