import { Component, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../../layout/services/layout.service';
import { GalleriaModule } from 'primeng/galleria';

@Component({
    selector: 'landing-showcase-widget',
    imports: [ButtonModule, GalleriaModule],
    template: `
        <div class="text-center">
            <div class=" font-normal mb-2 text-4xl">Showcase</div>
            <span class="text-muted-color text-2xl">Here are a few images of how the platform looks.</span>
        </div>
        <div class="m-5" style="justify-self:center">
            <p-galleria [value]="images" [showIndicators]="true" [autoPlay]="true" [circular]="true" [showThumbnails]="false" [containerStyle]="{ 'max-width': '640px' }">
                <ng-template #item let-item>
                    <img [src]="item.itemImageSrc" style="width: 100%; display: block;" />
                </ng-template>
                <ng-template #caption let-item>
                    <div class="text-xl mb-2 font-bold">{{ item.title }}</div>
                    <p class="text-white">{{ item.alt }}</p>
                </ng-template>
            </p-galleria>
        </div>
    `
})
export class ShowcaseWidget {
    images = [
        {
            itemImageSrc:"src/assets/showcaseimages/img2.png",
            title: 'Dashboard',
            alt: 'The main dashboard view is currently WIP, currently just contains a simple description of how to use the site.'
        },
        {
            itemImageSrc:"src/assets/showcaseimages/img3.png",
            title: 'Weight Tracking',
            alt: 'Here you see how the weight tracking page looks like.'
        },
        {
            itemImageSrc:"src/assets/showcaseimages/img4.png",
            title: 'Birds',
            alt: 'This is where you can edit and add your birds.'
        }
    ]
    
    constructor(public layoutService: LayoutService) {}
}