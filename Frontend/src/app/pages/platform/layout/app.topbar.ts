import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../../layout/services/layout.service';
import { UserMenu } from './app.usermenu';
import { ImpersonationMenu } from './app.impersonationmenu';
import { JWTTokenHelpers } from '../helpers/jwtTokenHelpers';
import { PermissionHelpers } from '../helpers/permissionHelpers';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TagModule } from 'primeng/tag';
import { PermissionsTable } from '../../../../PermissionsTable';
import { AppConfigurator } from '../../../layout/app.configurator';
import { UserModel } from '../../../models/Core/userModel';
import { HttpClient } from '@angular/common/http';
import { APIURL } from '../../../../globals';
import { Endpoints } from '../../../../Endpoints';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, UserMenu, ImpersonationMenu, OverlayBadgeModule, TagModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/platform">
                @if (layoutService.isDarkTheme()) {
                    <img src="src/assets/images/logo_small_transparant.png" [style]="{ height: '45px' }" />
                } @else {
                    <img src="src/assets/images/logo_small_transparant_inv.png" [style]="{ height: '45px' }" />
                }
                <span>Feather Tracker</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
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
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <div class=" flex flex-row items-center justify-between">
                        <p-tag>
                            <i class="pi pi-crown" *ngIf="JWTTokenHelpers.IsStaff()"></i>
                            {{user.firstName}} {{user.lastName}}
                        </p-tag>
                    </div>
                    <div class="relative">
                        <p-button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-user"></i>
                        </p-button>
                        <app-usermenu [style]="{ 'z-index': '9999' }" />
                    </div>
                    <div class="relative" [hidden]="!CanImpersonate()">
                        <button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-at"></i>
                        </button>
                        <app-impersonationmenu [style]="{ 'z-index': '9999' }" />
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    user: UserModel = {} as UserModel;
    unreadMessages: number = 0;

    JWTTokenHelpers = JWTTokenHelpers;

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient
    ) {
    }

    ngOnInit(){
        this.http.get<UserModel>(APIURL + Endpoints.Core.Users.Get_User + "?ID=" + JWTTokenHelpers.GetUserID()).subscribe(r => this.user = r)
    }

    showUnreadMessageBadge() {
        return this.unreadMessages == 0;
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    CanImpersonate(): boolean {
        if (PermissionHelpers.HasPermission(PermissionsTable.Core_User_Impersonate) == true || localStorage.getItem('impersonating')) return true;
        return false;
    }
}
