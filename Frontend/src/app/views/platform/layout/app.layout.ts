import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EzUILayout, MenuItem } from "@kris701/ez-ui";
import { TuiButton, TuiTitle } from "@taiga-ui/core";
import { TuiProgress } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import { BirdsService } from '../pages/cor/services/birdsService';
import { RecipiesService } from '../pages/fod/services/recipiesService';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [EzUILayout, TuiProgress, TuiCardMedium, TuiTitle, TuiButton],
    template: `
	<ezui-layout [sidebarItems]="sidebarItems" [sidebarFooterItems]="sidebarFooterItems">
		<ng-template #topbarlogo>
			<img src="logo.png" [style]="{ height: '45px' }" />
			<span>Feathertracker</span>
		</ng-template>
		<ng-template #topbarright>
			<button
				iconStart="log-out"
				tuiIconButton
				type="button"
				size="s"
				appearance="flat-grayscale"
				(click)="logOut()"
			>
			</button>
		</ng-template>
	</ezui-layout>

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
    `
})
export class AppLayout {
    cachesLoaded = signal<boolean>(false);
    cacheLoadStage = signal<number>(0);

	sidebarItems = signal<MenuItem[]>([
		{
			label: 'Loading...',
			icon: 'loader-circle',
			visible: true
		} as MenuItem
	])

	sidebarFooterItems = signal<MenuItem[]>([
		{
			label: 'Repo',
			icon: 'github',
			command: async () => {
				open('https://github.com/kris701/FeatherTracker');
			},
			visible : true
		} as MenuItem
	])

	loadedOnce = signal<boolean>(false);
    constructor(
        public birdsService : BirdsService,
        public recipieServices : RecipiesService,
		private router: Router,
    ){
		this.birdsService.onUpdated.subscribe((v) => this.ngOnInit())
        this.recipieServices.onUpdated.subscribe((v) => this.ngOnInit())
    }

    async ngOnInit(){
		if (!this.loadedOnce()){
			this.cachesLoaded.set(false);
			var loadMax = 2;
			var loaded = 1;

			await this.birdsService.Load();
			this.cacheLoadStage.set(Math.round((loaded++ / loadMax) * 100));
			await this.recipieServices.Load();
			this.cacheLoadStage.set(Math.round((loaded++ / loadMax) * 100));

			this.cacheLoadStage.set(100);
			this.cachesLoaded.set(true);
			this.loadedOnce.set(true)
		}

		var birds = await this.birdsService.List();
		var recipies = await this.recipieServices.List();

        this.sidebarItems.set([
            {
                label: 'Dashboard',
                icon: 'info',
                routerLink: '/platform',
				visible: true
            } as MenuItem,
            {
                label: 'Weights',
                icon: 'weight',
				visible : true,
                items: birds.map(x => {return {
					icon: '',
                    label: x.name,
                    routerLink: '/platform/WGT/weights',
                    queryParams: {'id':x.id},
					visible: true,
                } as any})
            } as MenuItem,
            {
                label: 'Birds',
                icon: 'bird',
				visible: true,
                items: [
                    {
                        icon:'plus',
                        routerLink: '/platform/COR/birds',
                        queryParams: {'add':''},
                        label:'Add',
						visible: true
                    } as any,
                    ... birds.map(x => {return {
						icon: '',
                        label: x.name,
                        routerLink: '/platform/COR/birds',
                        queryParams: {'id':x.id},
						visible: true
                    } as any})
                ] as MenuItem[]
            } as MenuItem,
            {
                label: 'Recipies',
                icon: 'cooking-pot',
				visible: true,
                items: [
                    {
                        icon:'plus',
                        routerLink: '/platform/FOD/recipies',
                        queryParams: {'add':''},
                        label:'Add',
						visible: true
                    } as any,
                    ... recipies.map(x => {return {
						icon: '',
                        label: x.name,
                        routerLink: '/platform/FOD/recipies',
                        queryParams: {'id':x.id},
						visible: true
                    } as any})
                ] as MenuItem[]
            } as MenuItem
        ]);
    }

    logOut() {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/']);
    }
}
