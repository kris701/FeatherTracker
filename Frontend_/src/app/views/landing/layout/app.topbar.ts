import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { JWTTokenHelpers } from '../../../common/helpers/jwtTokenHelpers';
import { LayoutService } from '../../../common/services/layoutService';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, TuiButton],
    template: `
	<div class="app-topbar-container">
		<div class="flex flex-grow"></div>
		<div class="button-container">
			<button tuiButton size="m" appearance="flat" (click)="toggleDarkMode()" [iconStart]="layoutService.isDarkMode() ? 'moon' : 'sun'"></button>
			<button tuiButton size="m" appearance="flat" [iconStart]="getLoginIcon()" (click)="doLoginAction()">{{getLoginText()}}</button>
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
				background: conic-gradient(var(--darkreader-bg--tui-background-neutral-1) 0 0),conic-gradient(var(--darkreader-bg--tui-background-base) 0 0);
			}
		}
	`
})
export class AppTopbar {
    localStorage = localStorage;

    constructor(
        public layoutService: LayoutService,
        public router: Router
    ) {}

    toggleDarkMode() {
        this.layoutService.ToggleDarkMode();
    }

    doLoginAction() {
        if (this.router.url.includes('/auth')) this.router.navigate(['/']);
        else if (JWTTokenHelpers.IsTokenSet()) this.router.navigate(['/platform/']);
        else this.router.navigate(['/auth']);
    }

    getLoginText(): string {
        if (this.router.url.includes('/auth')) return 'Return';
        if (JWTTokenHelpers.IsTokenSet()) return 'Enter Feather Tracker';
        return 'Login';
    }

	getLoginIcon(): string {
        if (this.router.url.includes('/auth')) return 'arrow-left';
        return 'log-in';
    }
}
