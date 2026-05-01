import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { StyleClassModule } from 'primeng/styleclass';
import { TagModule } from 'primeng/tag';
import { LayoutService } from '../../../services/layoutService';
import { JWTTokenHelpers } from '../../platform/helpers/jwtTokenHelpers';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, OverlayBadgeModule, TagModule, ButtonModule],
    template: ` <div class="justify-between" style="background:transparent">
        <div class="items-center grow justify-between flex absolute static w-full">
            <div class="flex flex-grow"></div>
            <div class="flex flex-row gap-2 card p-2!" style="border-radius: 0 0 0 10px">
                <p-button (click)="toggleDarkMode()" [icon]="layoutService.state.isDarkMode ? 'pi pi-moon' : 'pi pi-sun'" text severity="contrast" />
                <p-button [label]="getLoginText()" [icon]="getLoginIcon()" (click)="doLoginAction()" text/>
            </div>
        </div>
    </div>`
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
        return 'Feather Tracker';
    }

    getLoginIcon(): string {
        if (this.router.url.includes('/auth')) return 'pi pi-arrow-left';
        if (JWTTokenHelpers.IsTokenSet()) return 'pi pi-external-link';
        return 'pi pi-sign-in';
    }
}
