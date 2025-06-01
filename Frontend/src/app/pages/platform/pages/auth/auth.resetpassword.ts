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
import { APIURL } from '../../../../../globals';
import { Endpoints } from '../../../../../Endpoints';
import { TagModule } from 'primeng/tag';
import { AppFloatingConfigurator } from '../../../../layout/app.floatingconfigurator';
import { LayoutService } from '../../../../layout/services/layout.service';
import { FloatTextInput } from "../../../../common/floattextinput";
import { FieldsetModule } from 'primeng/fieldset';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-resetpassword',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, TagModule, FloatTextInput, FieldsetModule, DialogModule, InputOtpModule, ProgressSpinnerModule],
    template: `
        <app-floating-configurator />
        <p-tag [style]="{ 'position': 'absolute', 'left':'15px', 'top':'15px' }">Running on API: {{ apiUrl }}</p-tag>
        <div class=" flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center w-full">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 2%, rgba(33, 150, 243, 0) 110%); width:50%">
                    <div class="w-full card py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <a class="pi pi-arrow-left" routerLink="/platform/auth"></a>
                        <div class="text-center mb-2">
                            <span class="text-muted-color font-medium">Input email to send a temporary password to</span>
                        </div>

                        <div class="flex flex-col gap-2">
                            <app-floattextinput [(value)]="resetEmail" label="E-Mail" icon="pi-envelope"/>
                            <p-button label="Reset password" styleClass="w-full" (click)="doResetPassword()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="isLoading" header="Loading" [breakpoints]="{ '960px': '95vw' }" [modal]="true" [draggable]="false" [closable]="false">
            <div class="card flex flex-col gap-2 items-center">
                <p-progress-spinner *ngIf="isLoading"/>
            </div>
        </p-dialog>
    `
})
export class ResetPassword {
    constructor(private router: Router, private http: HttpClient, private service: MessageService, layoutService: LayoutService){
        this.layoutService = layoutService;
     }

    layoutService : LayoutService;
    apiUrl : string = APIURL;
    resetEmail : string = "";
    isLoading : boolean = false;

    doResetPassword(){
        if (!this.validateEmail(this.resetEmail)){
            alert("Email is invalid!");
        }
        else {
            this.isLoading = true;
            this.http.post(APIURL + Endpoints.Core.Users.Post_ResetPassword + "?Email=" + this.resetEmail, {}).subscribe(r => {
                this.service.add({ severity: 'success', summary: 'Info Message', detail: 'Password have been reset! Check your email inbox.' });
                this.isLoading = false;
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
