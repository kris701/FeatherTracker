import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { StyleClassModule } from 'primeng/styleclass';
import { CarouselModule } from 'primeng/carousel';
import { HeroWidget } from "./landing.herowidget";
import { WhatWeDoWidget } from "./landing.whatwedowidget";
import { ShowcaseWidget } from "./landing.showcase";

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, TagModule, StyleClassModule, CarouselModule, HeroWidget, WhatWeDoWidget, ShowcaseWidget],
    template: `
        <div class="layout-main">
            <div id="home" class="landing-wrapper overflow-hidden">
                <landing-hero-widget />
                <div class="h-[3rem]"></div>
                <landing-whatwedo-widget />
                <landing-showcase-widget/>
            </div>
        </div>
    `
})
export class LandingPage {}
