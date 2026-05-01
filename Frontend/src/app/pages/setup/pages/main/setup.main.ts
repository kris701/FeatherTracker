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
import { APIURL } from '../../../../../globals';
import { FloatPasswordInput } from "../../../../common/components/floatpasswordinput";
import { FloatTextInput } from "../../../../common/components/floattextinput";
import { AuthRequest } from '../../../../models/COR/authRequest';
import { SetupInput } from '../../../../models/COR/setupInput';
import { LayoutService } from '../../../../services/layoutService';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, TagModule, StyleClassModule, CarouselModule, FloatTextInput, FloatPasswordInput],
    template: `
        <div class="flex flex-col gap-2 items-center h-full" style="justify-content: center;">
            <div class="flex flex-col gap-2 items-center">
                <div style="border-radius: 15px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 2%, rgba(33, 150, 243, 0) 110%)">
                    <div class="card" style="border-radius: 15px">
                        <div class="text-center mb-2">
                            @if (layoutService.state.isDarkMode) {
                                <img class="mb-2 w-64 shrink-0 mx-auto" src="src/assets/images/logo.png" />
                            } @else {
                                <img class="mb-2 w-64 shrink-0 mx-auto" src="src/assets/images/logo_inv.png" />
                            }
                            <div class="text-3xl font-medium mb-4">Setup!</div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <span>Some small setup is required before you can start using Feather Tracker</span>
                            <span>Input the username and password you would like to log in with:</span>

                            <app-floattextinput label="Username" [(value)]="model.user.username" [autoFocus]="true" />

                            <app-floatpasswordinput label="Password" [(value)]="model.user.password" />

                            <p-button label="Save" styleClass="w-full" (click)="submit()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    host:{
        class:'flex flex-col h-full'
    }
})
export class LandingPage {
    model : SetupInput = { user: { username: 'admin', password: 'admin' } as AuthRequest } as SetupInput;

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient
    ) {}

    async submit(){
        await firstValueFrom(this.http.post(APIURL + Endpoints.COR.Setup.Post_Setup, this.model));
        window.location.replace('/');
    }
}
