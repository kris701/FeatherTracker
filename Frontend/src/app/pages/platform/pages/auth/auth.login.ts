import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { APIURL } from '../../../../../globals';
import { Endpoints } from '../../../../../Endpoints';
import { AuthenticationOutput } from '../../../../models/Core/authenticationOutput';
import { AuthenticateInput } from '../../../../models/Core/authenticateInput';
import { JWTTokenModel } from '../../../../models/Core/jWTTokenModel';
import { TagModule } from 'primeng/tag';
import { AppFloatingConfigurator } from '../../../../layout/app.floatingconfigurator';
import { LayoutService } from '../../../../layout/services/layout.service';
import { FloatTextInput } from "../../../../common/floattextinput";
import { FloatPasswordInput } from "../../../../common/floatpasswordinput";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, TagModule, FloatTextInput, FloatPasswordInput],
    template: `
        <app-floating-configurator />
        <p-tag [style]="{ 'position': 'absolute', 'left':'15px', 'top':'15px' }">Running on API: {{ apiUrl }}</p-tag>
        <div class=" flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 2%, rgba(33, 150, 243, 0) 110%)">
                    <div class="w-full card py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-2">
                            @if (layoutService.isDarkTheme())
                            {
                                <img class="mb-2 w-64 shrink-0 mx-auto" src="src/assets/images/logo_large_transparant.png"/>
                            }
                            @else
                            {
                                <img class="mb-2 w-64 shrink-0 mx-auto" src="src/assets/images/logo_large_transparant_inv.png"/>
                            }
                            <div class="text-3xl font-medium mb-4">Welcome to Feather Tracker!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div class="flex flex-col gap-2">
                            <app-floattextinput [(value)]="LoginName" label="Username"/>
                            <app-floatpasswordinput [(value)]="Password" label="Password"/>

                            <p-button label="Sign In" styleClass="w-full" (click)="doLogin()"></p-button>
                            <p-button label="Sign up" severity="secondary" styleClass="w-full" (click)="doSignUp()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    constructor(private router: Router, private http: HttpClient, layoutService: LayoutService){
        this.layoutService = layoutService;
     }

    layoutService : LayoutService;
    apiUrl : string = APIURL;
    LoginName: string = '';

    Password: string = '';

    ngOnInit(){
        if (!localStorage.getItem("jwtToken")){
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("perms");
        }
    }

    doLogin() {
        var input = {
            username: this.LoginName,
            password: this.Password
        } as AuthenticateInput;
        this.http.post<AuthenticationOutput>(APIURL + Endpoints.Core.Authentication.Post_Authenticate, input).subscribe(c => {
            if (c.jwtToken != "")
            {
                localStorage.removeItem("perms");
                const helper = new JwtHelperService();
                var result = helper.decodeToken<JWTTokenModel>(c.jwtToken);
                if (!result)
                    return;
                if (result.role == null)
                    result.role = [];
                var permsStr = "";
                result.role.forEach(p => {
                    permsStr += p + ";"
                });
                localStorage.setItem("perms", permsStr);
                localStorage.setItem("jwtToken", c.jwtToken);
                this.router.navigate(["/platform"]);
            }
        }, e => {
            alert("Username or Password is incorrect!");
        });
    }

    doSignUp(){
        this.router.navigate(["/platform/auth/signup"]);
    }
}
