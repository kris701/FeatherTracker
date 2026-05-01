import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../../../services/layoutService';
import { AppTopbar } from './app.topbar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, RouterModule],
    template: `
        @if (layoutService.state.isDarkMode) {
            <div class="w-full h-full absolute" style="background:black;z-index:-2"></div>
        } @else {
            <div class="w-full h-full absolute" style="background:white;z-index:-2"></div>
        }
        <video #backgroundvideo class="video-background" src="src/assets/videos/background.mp4" autoplay muted="true" loop playsinline webkit-playsinline="true"></video>
        <app-topbar></app-topbar>
        <router-outlet></router-outlet>`,
    host:{
        class:'flex flex-col h-full',
        style:'height:100vh'
    },
    styles: `
         ::ng-deep.video-background {
            left: 0px;
            top: 0px;
            scale: 1;
            position: fixed;
            min-width: 100%;
            min-height: 100%;
            opacity: 0.3;
            z-index:-1;
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
