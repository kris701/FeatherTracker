import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmDialog } from "primeng/confirmdialog";
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { BirdsService } from '../services/birdsService';
import { AppFooter } from './app.footer';
import { AppSidebar } from './app.sidebar';
import { AppTopbar } from './app.topbar';
import { AppVersion } from './app.version';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, TagModule, TooltipModule, AppVersion, ConfirmDialog],
    template: `
    <div class="layout-wrapper">
        <div class="flex flex-col w-full h-full">
            <app-topbar></app-topbar>
            <div class="flex flex-row w-full h-full" style="overflow:hidden">
                <app-sidebar></app-sidebar>
                <div class="layout-main-container">
                    <div class="layout-main">
                        <router-outlet></router-outlet>
                    </div>
                    <app-footer></app-footer>
                </div>
            </div>
        </div>
        <app-version />
        <p-confirmdialog />
    </div>
    `,
    styles: `
    .layout-wrapper {
        display: flex;
        flex-direction: column;
        height:100vh;
        min-height: 100vh;
        max-height: 100vh;
    }

    .layout-main-container {
        display: flex;
        flex-direction: column;
        min-height: inherit;
        max-height: inherit;
        overflow:auto;
        width:100%;
        justify-content: space-between;
        padding: 2rem 2rem 0 2rem;
    }

    .layout-main {
        flex: 1 1 auto;
        padding-bottom: 2rem;
        display: flex;
        flex-direction: column;
    }
    `
})
export class AppLayout {
    constructor(public birdsService : BirdsService){
    }

    async ngOnInit(){
        await this.birdsService.Load();
    }
}
