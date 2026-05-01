import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { StyleClassModule } from 'primeng/styleclass';
import { TagModule } from 'primeng/tag';
import { LayoutService } from '../../../services/layoutService';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, OverlayBadgeModule, TagModule, ButtonModule],
    template: ` <div class="justify-between" style="background:transparent">
        <div class="items-center grow justify-between flex absolute static w-full">
            <div class="flex flex-grow"></div>
            <div class="flex flex-row gap-2 card p-2!" style="border-radius: 0 0 0 10px">
                <p-button (click)="toggleDarkMode()" [icon]="layoutService.state.isDarkMode ? 'pi pi-moon' : 'pi pi-sun'" text severity="contrast" />
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
}
