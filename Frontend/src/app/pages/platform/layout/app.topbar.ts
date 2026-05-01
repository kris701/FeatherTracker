import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PopoverModule } from 'primeng/popover';
import { StyleClassModule } from 'primeng/styleclass';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { LayoutService } from '../../../services/layoutService';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, OverlayBadgeModule, TagModule, TooltipModule, ButtonModule, PopoverModule],
    template: `
    <div class="layout-topbar">
        <p-button class="layout-menu-button" text severity="contrast" icon="pi pi-bars" (click)="layoutService.ToggleMenu()" />

        <a class="layout-topbar-logo ml-5" routerLink="/platform">
            @if (layoutService.state.isDarkMode) {
                <img src="src/assets/images/logo.png" [style]="{ height: '45px' }" />
            } @else {
                <img src="src/assets/images/logo_inv.png" [style]="{ height: '45px' }" />
            }
            @if (layoutService.state.isDesktop) {
                <span>Feather Tracker</span>
            }
        </a>

        <div class="flex-grow"></div>

        <p-button (click)="toggleDarkMode()" [icon]="layoutService.state.isDarkMode ? 'pi pi-moon' : 'pi pi-sun'" text severity="contrast" />
        <p-button icon="pi pi-sign-out" severity="contrast" text pTooltip="Log out and return to the login screen" (click)="logOut()" />
    </div>`,
    styles: `
    .layout-topbar {
        height: 4rem;
        width: 100%;
        padding: 0 2rem;
        background-color: var(--surface-card);
        display: flex;
        flex-direction: row;
        align-items: center;
        border-image: linear-gradient(to right, var(--primary-contrast-color) -10%, var(--primary-color) 50%, var(--primary-contrast-color) 110%) 1;
        border-bottom: 3px solid;

        .layout-topbar-logo {
            display: inline-flex;
            align-items: center;
            font-size: 1.5rem;
            gap: 0.5rem;
        }

        ::ng-deep p-button {
            height:100%
        }

        ::ng-deep.p-button {
            margin:0;
            height:100%;
            width:4rem;
            border-radius: 0;
        }
    }
`
})
export class AppTopbar {
    constructor(
        private router: Router,
        public layoutService: LayoutService,
    ) {
    }

    toggleDarkMode() {
        this.layoutService.ToggleDarkMode();
    }

    logOut() {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/']);
    }
}
