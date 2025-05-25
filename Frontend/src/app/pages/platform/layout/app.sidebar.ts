import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';
import { LayoutService } from '../../../layout/services/layout.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        @if (layoutService.isDarkTheme()) {
            <img src="src/assets/images/logo_menu.png" [style]="{ position: 'absolute', opacity: '0.1', 'max-width': '80%', 'margin-left': '-20px', 'margin-top': '-10px' }" />
        } @else {
            <img src="src/assets/images/logo_menu_inv.png" [style]="{ position: 'absolute', opacity: '0.1', 'max-width': '80%', 'margin-left': '-20px', 'margin-top': '-10px' }" />
        }
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    layoutService: LayoutService;

    constructor(
        public el: ElementRef,
        layoutService: LayoutService
    ) {
        this.layoutService = layoutService;
    }
}
