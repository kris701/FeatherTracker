import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { Endpoints } from '../../../../../../Endpoints';
import { APIURL } from '../../../../../../globals';
import { FloatPasswordInput } from '../../../../../common/components/floatpasswordinput';
import { FloatTextInput } from '../../../../../common/components/floattextinput';
import { AuthRequest } from '../../../../../models/COR/authRequest';
import { AuthResponse } from '../../../../../models/COR/authResponse';
import { JWTTokenModel } from '../../../../../models/COR/jWTTokenModel';
import { LayoutService } from '../../../../../services/layoutService';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        TagModule,
        DialogModule,
        ProgressSpinnerModule,
        CommonModule,
        FloatTextInput,
        FloatPasswordInput,
        MessageModule,
    ],
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
                            <div class="text-3xl font-medium mb-4">Welcome to Feather Tracker!</div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-center">Username and Password</label>
                            <label class="text-center" *ngIf="loginWasInvalid" [style]="{ color: 'red' }">Username or Password is invalid!</label>

                            <app-floattextinput label="Username" [(value)]="loginName" [autoFocus]="true" />

                            <app-floatpasswordinput label="Password" [(value)]="password" (onEnter)="doDefaultLogin()" />

                            <p-button label="Sign In" styleClass="w-full" (click)="doDefaultLogin()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p-progress-spinner ariaLabel="loading" [hidden]="!isLoggingIn" class="login-loading" />
    `,
    styles: `
        ::ng-deep .login-loading {
            top:40vh;
            left:40vw;
            position:fixed !important;
            height:20vh !important;
            width:20vw !important;
        }
    `,
    host:{
        class:"h-full"
    }
})
export class Login {
    route = inject(ActivatedRoute);
    constructor(
        private http: HttpClient,
        public layoutService: LayoutService
    ) {}

    loginName: string = '';
    password: string = '';
    isLoggingIn: boolean = false;
    loginWasInvalid: boolean = false;

    async ngOnInit() {
        if (!localStorage.getItem('jwtToken')) {
            localStorage.removeItem('jwtToken');
        }
    }

    doDefaultLogin() {
        this.isLoggingIn = true;
        this.loginWasInvalid = false;
        var input = {
            username: this.loginName,
            password: this.password
        } as AuthRequest;
        this.http.post<AuthResponse>(APIURL + Endpoints.COR.Auth.Post_LogIn, input).subscribe(
            (c) => this.processAuthResult(c),
            (e) => {
                this.isLoggingIn = false;
                this.loginWasInvalid = true;
            }
        );
    }

    processAuthResult(c: AuthResponse) {
        if (c.token != '') {
            this.loginWasInvalid = false;
            localStorage.removeItem('perms');
            const helper = new JwtHelperService();
            var result = helper.decodeToken<JWTTokenModel>(c.token);
            if (!result) return;
            localStorage.setItem('jwtToken', c.token);

            if (this.route.snapshot.queryParamMap.has('redirect')) {
                var redirectTarget = this.route.snapshot.queryParamMap.get('redirect');
                if (redirectTarget) window.location.replace(redirectTarget);
                else window.location.replace('/platform');
            } else window.location.replace('/platform');
        }
    }
}
