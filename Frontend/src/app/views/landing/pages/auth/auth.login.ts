import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TuiButton, TuiInput, TuiLoader, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Endpoints } from '../../../../../Endpoints';
import { FloatPasswordInput } from "../../../../common/components/floatpasswordinput";
import { FloatTextInput } from "../../../../common/components/floattextinput";
import { JWTTokenModel } from '../../../../common/helpers/jwtTokenHelpers';
import { AuthRequest } from '../../../../models/COR/authRequest';
import { AuthResponse } from '../../../../models/COR/authResponse';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    TuiButton,
    TuiInput,
    TuiLoader,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    FloatTextInput,
    FloatPasswordInput
],
    template: `
		<div class="flex h-full w-full items-center">
			<tui-loader [overlay]="true" [loading]="isLoggingIn()">
				<div appearance="floating" tuiCardLarge>
					<header tuiHeader>
						<h2 tuiTitle>
							<img src="logo.png" />
							Welcome to Feather Tracker!
						</h2>
					</header>

					<section class="flex flex-col gap-2">
						<label class="text-center">Username and Password</label>
						@if(loginWasInvalid()){
							<label class="text-center" [style]="{ color: 'red' }">Username or Password is invalid!</label>
						}

						<app-floattextinput id="username" label="Username" [(value)]="loginName"/>

						<app-floatpasswordinput id="password" label="Password" [(value)]="password" (key.enter)="doDefaultLogin()"/>
					</section>

					<footer>
						<button tuiButton class="w-full" iconStart="log-in" (click)="doDefaultLogin()">Sign In</button>
					</footer>
				</div>
			</tui-loader>
		</div>
    `,
    host:{
        class:"h-full"
    }
})
export class AuthLogin {
    route = inject(ActivatedRoute);
    constructor(
        private http: HttpClient,
    ) {}

    loginName = signal<string>('');
    password = signal<string>('');
    isLoggingIn = signal<boolean>(false);
    loginWasInvalid = signal<boolean>(false);

    async ngOnInit() {
        if (!localStorage.getItem('jwtToken')) {
            localStorage.removeItem('jwtToken');
        }
    }

    doDefaultLogin() {
        this.isLoggingIn.set(true);
        this.loginWasInvalid.set(false);
        var input = {
            username: this.loginName(),
            password: this.password()
        } as AuthRequest;
        this.http.post<AuthResponse>(Endpoints.COR.Auth.Post_LogIn, input).subscribe(
            (c) => this.processAuthResult(c),
            (e) => {
                this.isLoggingIn.set(false);
                this.loginWasInvalid.set(true);
            }
        );
    }

    async processAuthResult(c: AuthResponse) {
        if (c.token != '') {
            this.loginWasInvalid.set(false);
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
