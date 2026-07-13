import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiScrollbar, TuiTitle } from "@taiga-ui/core";
import { TuiProgress } from '@taiga-ui/kit';
import { TuiCardMedium, TuiNavigation } from '@taiga-ui/layout';
import { BirdsService } from '../pages/cor/services/birdsService';
import { RecipiesService } from '../pages/fod/services/recipiesService';
import { AppSideBar } from "./app.sidebar";
import { AppTopBar } from "./app.topbar";

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, AppTopBar, AppSideBar, TuiNavigation, TuiScrollbar, TuiProgress, TuiCardMedium, TuiTitle],
    template: `
    <div class="layout-wrapper">
		<div class="flex flex-col w-full h-full">
			<app-topbar></app-topbar>
			<div class="flex flex-row w-full h-full" style="overflow:hidden;max-width:100vw">
				<app-sidebar></app-sidebar>
				<div class="layout-main-container">
					<tui-scrollbar class="layout-main">
						<router-outlet></router-outlet>
					</tui-scrollbar>
				</div>
			</div>
		</div>
        @if(!cachesLoaded()){
            <div tuiCardMedium [style]="{'position':'fixed', 'bottom':'0', 'right':'0', 'margin':'10px', 'border':'1px solid #415B61'}">
				<h2 tuiTitle>
					Loading Caches...
				</h2>
				<tui-progress-circle
					size="s"
					[max]="100"
					[value]="cacheLoadStage()"
				/>
            </div>
        }
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
			width:100%;
			justify-content: space-between;
		}

		.layout-main {
			flex: 1 1 auto;
			display: flex;
		}

		::ng-deep .layout-main > .t-content {
			padding:1rem;
			display:flex;
			block-size:auto !important;
		}
	`
})
export class AppLayout {
    cachesLoaded = signal<boolean>(false);
    cacheLoadStage = signal<number>(0);

    constructor(
        public birdsService : BirdsService,
        public recipieServices : RecipiesService,
    ){
    }

    async ngOnInit(){
        this.cachesLoaded.set(false);
        var loadMax = 2;
        var loaded = 1;

        await this.birdsService.Load();
        this.cacheLoadStage.set(Math.round((loaded++ / loadMax) * 100));
		await this.recipieServices.Load();
        this.cacheLoadStage.set(Math.round((loaded++ / loadMax) * 100));

        this.cacheLoadStage.set(100);
        this.cachesLoaded.set(true);
    }
}
