import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../layout/services/layout.service';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    imports: [TagModule, CommonModule],
    selector: 'app-footer',
    template: `<div class="layout-footer-landing">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-3">
                <a (click)="router.navigate(['/pages/landing'], { fragment: 'home' })" class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-6 cursor-pointer">
                    @if (layoutService.isDarkTheme()) {
                        <img src="src/assets/images/logo_small_transparant.png" [style]="{ height: '45px' }" />
                    } @else {
                        <img src="src/assets/images/logo_small_transparant_inv.png" [style]="{ height: '45px' }" />
                    }
                    <h4 class="font-medium text-3xl">Feather Tracker</h4>
                </a>
            </div>

            <div class="col-span-12 md:col-span-9">
                <div class="grid grid-cols-12 gap-8 text-center md:text-left">
                    <div class="col-span-12 md:col-span-6">
                        <h4 class="font-medium text-2xl leading-normal mb-6">Contact</h4>
                        <span class="leading-normal text-xl block mb-2">
                            <i class="pi pi-envelope"></i>
                            kris701kj&#64;gmail.com</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class AppFooter {
    constructor(
        public router: Router,
        public layoutService: LayoutService
    ) {}
}
