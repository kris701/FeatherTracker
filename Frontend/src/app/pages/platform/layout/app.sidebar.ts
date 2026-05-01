import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { LayoutService } from '../../../services/layoutService';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [PanelMenuModule],
    template: `
    <div class="layout-sidebar" [hidden]="!layoutService.state.isMenuExpanded">
        <p-panelmenu [model]="model" class="layout-menu" [multiple]="true">
            <ng-template #headericon let-item>
            </ng-template>
        </p-panelmenu>
    </div>
    `,
    styles: `
    .layout-sidebar {
        width: 20rem;
        height: 100%;
        z-index:999;
        overflow-y: auto;
        background-color: var(--surface-overlay);
        padding: 0.5rem 1.5rem;

        border-image: linear-gradient(to top, var(--primary-contrast-color) -10%, var(--primary-color) 50%, var(--primary-contrast-color) 110%) 1;
        border-right: 3px solid;
    }

    ::ng-deep.mobile .layout-sidebar {
        position:fixed;
    }

    ::ng-deep.layout-menu {
        gap: 0px !important
    }

    ::ng-deep.layout-menu > .p-panelmenu-panel {
        background: transparent !important;
        border: 0;
    }

    ::ng-deep.layout-menu .p-panelmenu-header-label {
        font-weight: bold;
        font-size: 16px;
    }

    ::ng-deep.p-panelmenu-item-link-active {
        color:var(--primary-color) !important
    }

    ::ng-deep.p-focus {
        color:var(--primary-color) !important
    }
    `
})
export class AppSidebar {
    model: MenuItem[] = [];
    haveMoved: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private router: Router
    ) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd)
                this.processMenuState();
        });
    }

    processMenuState(){
        if (!this.layoutService.state.isDesktop)
            this.layoutService.SetMenu(false);
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-objects-column',
                routerLink: '/platform',
                visible: true,
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'Weights',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: '/platform/WGT/weights',
                visible: true,
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'Birds',
                icon: 'pi pi-fw pi-objects-column',
                routerLink: '/platform/COR/birds',
                visible: true,
                routerLinkActiveOptions: { exact: true }
            }
        ];

        this.hideEmptySections(this.model);

        if (!this.haveMoved && this.router.routerState.snapshot.url == '/platform') this.gotoFirstPage(this.model);

        this.setActiveRoute(this.model);
    }

    hideEmptySections(menu: MenuItem[]) {
        menu.forEach((x) => {
            if (x.items) {
                this.hideEmptySections(x.items);
                if (x.items.every((x) => x.visible == false)) {
                    x.visible = false;
                };
            }
        });
    }

    setActiveRoute(menu: MenuItem[], parent: MenuItem | null = null) {
        menu.forEach((x) => {
            if (x.routerLink) {
                if (x.routerLink == this.router.routerState.snapshot.url) {
                    x.expanded = true;
                    if (parent) parent.expanded = true;
                }
            }
            if (x.items) this.setActiveRoute(x.items, x);
        });
    }

    gotoFirstPage(menu: MenuItem[]) {
        var first = menu.find((x) => x.visible == true);
        if (first) {
            if (first.items) {
                this.gotoFirstPage(first.items);
            } else {
                this.haveMoved = true;
                this.router.navigate([first.routerLink]);
            }
        }
    }
}
