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
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IsEmailTakenInput } from '../../../../models/Core/isEmailTakenInput';
import { IsTakenOutput } from '../../../../models/Core/isTakenOutput';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, TagModule, FloatTextInput, FloatPasswordInput, FieldsetModule, DialogModule, InputOtpModule, ProgressSpinnerModule],
    template: `
        <app-floating-configurator />
        <p-tag [style]="{ 'position': 'absolute', 'left':'15px', 'top':'15px' }">Running on API: {{ apiUrl }}</p-tag>
        <div class=" flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center w-full">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 2%, rgba(33, 150, 243, 0) 110%); width:50%">
                    <div class="w-full card py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <a class="pi pi-arrow-left" routerLink="/platform/auth"></a>
                        <div class="text-center mb-2">
                            <span class="text-muted-color font-medium">Input your info to sign up</span>
                        </div>

                        <div class="flex flex-col gap-2">
                            <p-fieldset legend="Login Information">
                                <div class="flex flex-col gap-2">
                                    <p>The login name must be unique!</p>
                                    <p *ngIf="isUsernameTaken" style="color:red">Username already taken!</p>
                                    <app-floattextinput [(value)]="newUser.loginName" label="Username" icon="pi-sign-in" (valueChange)="checkUsername()"/>
                                    <app-floatpasswordinput [(value)]="newUser.password" label="Password" [feedback]="true"/>
                                    <app-floatpasswordinput [(value)]="repeatPassword" label="Repeat Password" [feedback]="true"/>
                                </div>
                            </p-fieldset>
                            <p-fieldset legend="General Information">
                                <div class="flex flex-col gap-2">
                                    <app-floattextinput [(value)]="newUser.firstName" label="First Name" icon="pi-pencil" />
                                    <app-floattextinput [(value)]="newUser.lastName" label="Last Name" icon="pi-pencil" />
                                    <p *ngIf="isEmailTaken" style="color:red">Email already taken!</p>
                                    <app-floattextinput [(value)]="newUser.email" label="E-Mail" icon="pi-envelope" (valueChange)="checkEmail()"/>
                                </div>
                            </p-fieldset>

                            <p-button label="Sign up" styleClass="w-full" (click)="doVerifySignUp()" [disabled]="isUsernameTaken"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="isVerificationCodeOpen" header="Verification Code" [breakpoints]="{ '960px': '95vw' }" [style]="{ width: '60vw' }" [modal]="true" [draggable]="false" [closable]="false">
            <div class="card flex flex-col gap-2 items-center">
                <p>A verification code have been send to the email {{newUser.email}}</p>
                <p-inputotp [(ngModel)]="newUser.emailToken" [length]="6" />
            </div>
            <ng-template #footer>
                <p-button label="Sign Up" icon="pi pi-save" (click)="doSignup()"/>
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="isLoading" header="Loading" [breakpoints]="{ '960px': '95vw' }" [modal]="true" [draggable]="false" [closable]="false">
            <div class="card flex flex-col gap-2 items-center">
                <p-progress-spinner *ngIf="isLoading"/>
            </div>
        </p-dialog>
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
    isUsernameTaken : boolean = false;
    isEmailTaken : boolean = false;
    isLoading : boolean = false;
    isVerificationCodeOpen : boolean = false;

    doVerifySignUp(){
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
        if (!this.validateEmail(this.newUser.email)){
            alert("Email is not valid!");
            return;
        }
        this.isLoading = true;
        this.http.post(APIURL + Endpoints.Core.Users.Post_VerifyUser, this.newUser).subscribe(r => {
            this.isVerificationCodeOpen = true;    
            this.isLoading = false;
        })
    }
    
    doSignup(){
        this.isLoading = true;
        this.http.post(APIURL + Endpoints.Core.Users.Post_SignupUser, this.newUser).subscribe(r => {
            this.isLoading = false;
            this.service.add({ severity: 'success', summary: 'Info Message', detail: 'Signup succesfull!' });
            this.router.navigate(["/platform/auth"]);
        })
    }
    
    checkUsername(){
        this.http.get<IsTakenOutput>(APIURL + Endpoints.Core.Users.Get_IsUsernameTaken + "?Username=" + this.newUser.loginName).subscribe(r => {
            this.isUsernameTaken = r.isTaken;
        })
    }

    checkEmail(){
        if (this.validateEmail(this.newUser.email)){
            this.http.get<IsTakenOutput>(APIURL + Endpoints.Core.Users.Get_IsEmailTaken + "?Email=" + this.newUser.email).subscribe(r => {
                this.isEmailTaken = r.isTaken;
            })
        }
    }

    validateEmail(email : string) {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };
}
