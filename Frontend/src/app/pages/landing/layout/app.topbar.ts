import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../../layout/services/layout.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TagModule } from 'primeng/tag';
import { AppConfigurator } from '../../../layout/app.configurator';
import { ButtonModule } from 'primeng/button';
import { JWTTokenHelpers } from '../../platform/helpers/jwtTokenHelpers';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, OverlayBadgeModule, TagModule, AppConfigurator, ButtonModule],
    template: ` <div class="layout-topbar justify-between">
        <div class="layout-topbar-logo-container">
            <a class="layout-topbar-logo" routerLink="/">
                @if (layoutService.isDarkTheme()) {
                    <img src="src/assets/images/logo_small_transparant.png" [style]="{ height: '45px' }" />
                } @else {
                    <img src="src/assets/images/logo_small_transparant_inv.png" [style]="{ height: '45px' }" />
                }
                <span>Feather Tracker</span>
            </a>
        </div>

        <a
            pButton
            [text]="true"
            severity="secondary"
            [rounded]="true"
            pRipple
            class="lg:!hidden"
            pStyleClass="@next"
            enterClass="hidden"
            leaveToClass="hidden"
            [hideOnOutsideClick]="true"
            enterActiveClass="animate-fadein"
            leaveActiveClass="animate-fadeout"
        >
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <div class="items-center card grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full p-10 lg:p-0 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a [routerLink]="'/'" pRipple class="px-0 py-4 font-medium text-xl" routerLinkActive="landing-active-route" [routerLinkActiveOptions]="{ paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }">
                        <span><i class="pi pi-home"></i> Home</span>
                    </a>
                </li>
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2" style="justify-content:end">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
                <button pButton pRipple [label]="getLoginText()" [icon]="getLoginIcon()" (click)="doLoginAction()" [rounded]="true" [text]="true"></button>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    constructor(
        public layoutService: LayoutService,
        public router: Router
    ) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    doLoginAction() {
        if (this.router.url.endsWith('/platform/auth')) this.router.navigate(['/']);
        else if (JWTTokenHelpers.IsTokenSet()) this.router.navigate(['/platform/']);
        else this.router.navigate(['/platform/auth']);
    }

    getLoginText(): string {
        if (this.router.url.endsWith('/platform/auth')) return 'Return';
        if (JWTTokenHelpers.IsTokenSet()) return 'Enter Platform';
        return 'Platform';
    }

    getLoginIcon(): string {
        if (this.router.url.endsWith('/platform/auth')) return 'pi pi-arrow-left';
        if (JWTTokenHelpers.IsTokenSet()) return 'pi pi-external-link';
        return 'pi pi-sign-in';
    }
}
