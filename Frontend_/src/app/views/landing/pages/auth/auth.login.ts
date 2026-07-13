import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TuiButton, TuiIcon, TuiInput, TuiLoader, TuiTitle } from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Endpoints } from '../../../../../Endpoints';
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
    TuiIcon,
    TuiInput,
    TuiPassword,
    TuiLoader,
	TuiCardLarge,
	TuiHeader,
	TuiTitle
],
    template: `
		<div class="flex h-full w-full items-center">
			<tui-loader [overlay]="true" [loading]="isLoggingIn()">
				<div appearance="floating" tuiCardLarge>
					<header tuiHeader>
						<h2 tuiTitle>
							<img class="mb-2 w-64 shrink-0 mx-auto" src="logo.png" />
							Welcome to Feather Tracker!
						</h2>
					</header>

					<section class="flex flex-col gap-2">
						<label class="text-center">Username and Password</label>
						@if(loginWasInvalid()){
							<label class="text-center" [style]="{ color: 'red' }">Username or Password is invalid!</label>
						}

						<tui-textfield>
							<input
								placeholder="Username"
								tuiInput
								id="username"
								[(ngModel)]="loginName"
								(key.enter)="doDefaultLogin()"
							/>
						</tui-textfield>

						<tui-textfield>
							<input
								placeholder="Password"
								tuiInput
								id="password"
								type="password"
								[(ngModel)]="password"
								(key.enter)="doDefaultLogin()"
							/>
							<tui-icon tuiPassword />
						</tui-textfield>
					</section>

					<footer>
						<button tuiButton class="w-full" iconStart="log-in" (click)="doDefaultLogin()">Sign In</button>
					</footer>
				</div>
			</tui-loader>
		</div>
    `,
    styles: `

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
