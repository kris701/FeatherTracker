import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiDropdown } from '@taiga-ui/core';
import { TuiAsideComponent, TuiAsideGroupComponent, TuiNavigation } from "@taiga-ui/layout";
import { LayoutService } from '../../../common/services/layoutService';
import { BirdsService } from '../pages/cor/services/birdsService';
import { RecipiesService } from '../pages/fod/services/recipiesService';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, TuiNavigation, TuiAsideGroupComponent, TuiAsideComponent, TuiDropdown],
    template: `
	    <aside
	        style="height:100%"
			tuitheme=""
	        [tuiNavigationAside]="layoutService.isMenuExpanded()"
	    >
			@for(item of menuItems(); track item){
				<tui-aside-group>
					<button
						[iconStart]="item.icon"
						tuiAsideItem
						tuiChevron
						type="button"
						[routerLinkActiveOptions]="{ exact:true }"
						[routerLink]="item.routerLink"
					>
						{{item.label}}
						<ng-template>
							@for(subitem of item.items; track subitem){
								<button
									tuiAsideItem
									[iconStart]="subitem.icon"
									type="button"
									[routerLinkActiveOptions]="{ exact:true }"
									[routerLink]="subitem.routerLink"
									[queryParams]="subitem.queryParams"
								>
									{{subitem.label}}
								</button>
							}
						</ng-template>
					</button>
				</tui-aside-group>
			}

			<hr />

			<footer>
				<a href="https://github.com/kris701/FeatherTracker" pButton target="_blank" rel="noopener noreferrer">
					<button
						iconStart="github"
						tuiAsideItem
						type="button"
					>
						Repo
					</button>
				</a>
			</footer>
	    </aside>
    `
})
export class AppSideBar {
	menuItems = signal<MenuItem[]>([{
		label: 'Loading...',
		icon: 'loader-circle'
	} as MenuItem])

    constructor(
          	public layoutService: LayoutService,
			private birdsService : BirdsService,
        	private recipiesService : RecipiesService
	){
	}

	async ngOnInit(){
		var birds = await this.birdsService.List();
		var recipies = await this.recipiesService.List();

        this.menuItems.set([
            {
                label: 'Dashboard',
                icon: 'info',
                routerLink: '/platform'
            } as MenuItem,
            {
                label: 'Weights',
                icon: 'weight',
                items: birds.map(x => {return {
					icon: '',
                    label: x.name,
                    routerLink: '/platform/WGT/weights',
                    queryParams: {'id':x.id}
                } as SubMenuItem})
            } as MenuItem,
            {
                label: 'Birds',
                icon: 'bird',
                items: [
                    {
                        icon:'plus',
                        routerLink: '/platform/COR/birds',
                        queryParams: {'add':''},
                        label:'Add'
                    } as SubMenuItem,
                    ... birds.map(x => {return {
						icon: '',
                        label: x.name,
                        routerLink: '/platform/COR/birds',
                        queryParams: {'id':x.id}
                    } as SubMenuItem})
                ]
            } as MenuItem,
            {
                label: 'Recipies',
                icon: 'cooking-pot',
                items: [
                    {
                        icon:'plus',
                        routerLink: '/platform/FOD/recipies',
                        queryParams: {'add':''},
                        label:'Add'
                    } as SubMenuItem,
                    ... recipies.map(x => {return {
						icon: '',
                        label: x.name,
                        routerLink: '/platform/FOD/recipies',
                        queryParams: {'id':x.id}
                    } as SubMenuItem})
                ] as SubMenuItem[]
            } as MenuItem
        ]);
	}
}

interface MenuItem {
	label: string,
	icon: string | null,
	routerLink: string | null,
	items: SubMenuItem[] | null
}

interface SubMenuItem {
	label: string,
	icon: string | null,
	routerLink: string | null
	queryParams: {[id:string]:string}
}
