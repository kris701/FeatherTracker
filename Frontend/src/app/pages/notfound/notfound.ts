import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/app.floatingconfigurator';
import { LayoutService } from '../../layout/services/layout.service';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
    template: ` <app-floating-configurator />
        <div class="flex items-center justify-center min-h-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                @if (layoutService.isDarkTheme())
                {
                    <img  class="mb-8 w-32 shrink-0 mx-auto" src="src/assets/images/logo_small_transparant.png"/>
                }
                @else
                {
                    <img  class="mb-8 w-32 shrink-0 mx-auto" src="src/assets/images/logo_small_transparant_inv.png"/>
                }
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 2%, rgba(33, 150, 243, 0) 110%)">
                    <div class="w-full card py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <span class="text-primary font-bold text-3xl">404</span>
                        <h1 class="font-bold text-3xl lg:text-5xl mb-2">Not Found</h1>
                        <div class="mb-8">Requested resource is not available.</div>
                        <p-button label="Go to Dashboard" routerLink="/" />
                    </div>
                </div>
            </div>
        </div>`
})
export class Notfound {
    layoutService : LayoutService;
    constructor(layoutService: LayoutService){
        this.layoutService = layoutService;
    } 
}
