import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { LayoutService } from '../../../common/services/layoutService';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, TuiNavigation, TuiButton],
    template: `
      <header tuiNavigationHeader tuitheme="">
          <button
              type="button"
              tuiIconButton
              [iconStart]="layoutService.isMenuExpanded() ? '@tui.chevron-left' : '@tui.chevron-right'"
              (click)="layoutService.ToggleMenu()"
          >
          </button>
          <span tuiNavigationLogo>
              <img src="logo.png" [style]="{ height: '45px' }" />
              <span tuiFade>ActFlow</span>
          </span>
		  <hr />
          <button
              [iconStart]="layoutService.isDarkMode() ? 'moon' : 'sun'"
              tuiIconButton
              type="button"
			  (click)="layoutService.ToggleDarkMode()"
          >
          </button>
      </header>
    `
})
export class AppTopBar {
  constructor(
      public layoutService: LayoutService
  ){}
}
