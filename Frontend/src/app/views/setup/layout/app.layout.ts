import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../../../common/services/layoutService';
import { AppTopbar } from './app.topbar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, RouterModule],
    template: `
		<div class="layout-landing-wrapper">
			<app-topbar></app-topbar>
			<video #backgroundvideo class="video-background" src="background.mp4" autoplay muted="true" loop playsinline webkit-playsinline="true"></video>
			<router-outlet></router-outlet>
		</div>
	`,
	host:{
		class:"w-full"
	},
    styles: `
		.layout-landing-wrapper {
			display: flex;
			flex-direction: column;
			height:100vh;
			min-height: 100vh;
			max-height: 100vh;
		}

         ::ng-deep.video-background {
            left: 0px;
            top: 0px;
            scale: 1;
            position: fixed;
            min-width: 100%;
            min-height: 100%;
            opacity: 0.3;
            z-index:-999;
            object-fit: cover;
        }
    `,
})
export class AppLayout {
    @ViewChild('backgroundvideo') backgroundvideo!: ElementRef<HTMLVideoElement>;

    constructor(
        public layoutService: LayoutService
    ) {}

    ngAfterViewChecked(){
        this.backgroundvideo.nativeElement.muted = true;
    }
}
