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
import { AddUserInput } from '../../../../models/Core/addUserInput';
import { FieldsetModule } from 'primeng/fieldset';
import { SignupUserInput } from '../../../../models/Core/signupUserInput';
import { IsUsernameTakenOutput } from '../../../../models/Core/isUsernameTakenOutput';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, TagModule, FloatTextInput, FloatPasswordInput, FieldsetModule],
    template: `
        <app-floating-configurator />
        <p-tag [style]="{ 'position': 'absolute', 'left':'15px', 'top':'15px' }">Running on API: {{ apiUrl }}</p-tag>
        <div class=" flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center w-full">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 2%, rgba(33, 150, 243, 0) 110%); width:50%">
                    <div class="w-full card py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-2">
                            <span class="text-muted-color font-medium">Input your info to sign up</span>
                        </div>

                        <div class="flex flex-col gap-2">
                            <p-fieldset legend="Login Information">
                                <div class="flex flex-col gap-2">
                                    <p>The login name must be unique!</p>
                                    <p *ngIf="isTaken" style="color:red">Username already taken!</p>
                                    <app-floattextinput [(value)]="newUser.loginName" label="Username" icon="pi-sign-in" (valueChange)="checkUsername()"/>
                                    <app-floatpasswordinput [(value)]="newUser.password" label="Password" [feedback]="true"/>
                                    <app-floatpasswordinput [(value)]="repeatPassword" label="Repeat Password" [feedback]="true"/>
                                </div>
                            </p-fieldset>
                            <p-fieldset legend="General Information">
                                <div class="flex flex-col gap-2">
                                    <app-floattextinput [(value)]="newUser.firstName" label="First Name" icon="pi-pencil" />
                                    <app-floattextinput [(value)]="newUser.lastName" label="Last Name" icon="pi-pencil" />
                                    <app-floattextinput [(value)]="newUser.email" label="E-Mail" icon="pi-envelope" />
                                </div>
                            </p-fieldset>

                            <p-button label="Sign up" styleClass="w-full" (click)="doSignUp()" [disabled]="isTaken"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class SignUp {
    constructor(private router: Router, private http: HttpClient, private service: MessageService, layoutService: LayoutService){
        this.layoutService = layoutService;
     }

    layoutService : LayoutService;
    apiUrl : string = APIURL;
    newUser : SignupUserInput = {} as SignupUserInput
    repeatPassword : string = "";
    isTaken : boolean = false;
    isLoading : boolean = false;

    doSignUp(){
        if (this.newUser.password != this.repeatPassword)
        {
            alert("Passwords are not the same!");
            return;
        }
        if (this.newUser.password.length < 6)
        {
            alert("Password must be at least 6 characters long!");
            return;
        }
        if (this.newUser.loginName.length < 4)
        {
            alert("Username must be at least 4 characters long!");
            return;
        }
        if (this.newUser.firstName == null || this.newUser.firstName == "")
        {
            alert("Missing first name!");
            return;
        }
        if (this.newUser.lastName == null || this.newUser.lastName == "")
        {
            alert("Missing last name!");
            return;
        }
        if (this.newUser.email == null || this.newUser.email == "")
        {
            alert("Missing email!");
            return;
        }
        const validateEmail = (email : string) => {
            return String(email)
                .toLowerCase()
                .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
            };
        if (!validateEmail(this.newUser.email)){
            alert("Email is not valid!");
            return;
        }
        this.http.post(APIURL + Endpoints.Core.Users.Post_SignupUser, this.newUser).subscribe(r => {
            this.service.add({ severity: 'success', summary: 'Info Message', detail: 'Signup succesfull!' });
            this.router.navigate(["/platform/auth"]);
        })
    }

    checkUsername(){
        this.http.get<IsUsernameTakenOutput>(APIURL + Endpoints.Core.Users.Get_IsUsernameTaken + "?Username=" + this.newUser.loginName).subscribe(r => {
            this.isTaken = r.isTaken;
        })
    }
}
