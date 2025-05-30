import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { LayoutService } from '../../../../layout/services/layout.service';

@Component({
    selector: 'landing-hero-widget',
    imports: [ButtonModule, RippleModule],
    template: `
        <div id="hero" style="justify-items:center">
            @if (layoutService.isDarkTheme()) {
                <img src="src/assets/images/logo_large_transparant.png" class="md:w-auto" />
            } @else {
                <img src="src/assets/images/logo_large_transparant_inv.png" class="md:w-auto" />
            }

            <p class="font-normal text-2xl leading-normal md:mt-">A simple website to track your birds weight.</p>
        </div>
    `
})
export class HeroWidget {
    constructor(public layoutService: LayoutService) {}
}