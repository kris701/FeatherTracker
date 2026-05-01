import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { TagModule } from 'primeng/tag';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from '../../../../../Endpoints';
import { environment } from '../../../../../environments/environment';
import { LayoutService } from '../../../../services/layoutService';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, TagModule, StyleClassModule, CarouselModule ],
    template: `
        <div class="flex flex-col gap-2 items-center h-full" style="justify-content: center;">
            <div class="flex flex-col gap-2 items-center">
                @if (layoutService.state.isDarkMode) {
                    <img class="mb-2 w-64 shrink-0 mx-auto" src="src/assets/images/logo.png" />
                } @else {
                    <img class="mb-2 w-64 shrink-0 mx-auto" src="src/assets/images/logo_inv.png" />
                }
                <h1 style="font-size:100px">Feather Tracker</h1>
                <h3 style="opacity:0.5;margin-top:0px">Keeping track of your featherly friends!</h3>
            </div>
        </div>
    `,
    host:{
        class:'flex flex-col h-full'
    }
})
export class LandingPage {
    constructor(
        public layoutService: LayoutService,
        public http : HttpClient
    ) {}

    async ngOnInit(){
        var isSetup = await firstValueFrom(this.http.get<boolean>(environment.APIURL + Endpoints.COR.Setup.Get_IsSetup));
        if (isSetup === false)
            window.location.replace('/setup');
    }
}
