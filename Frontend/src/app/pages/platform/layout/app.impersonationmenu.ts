import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { Endpoints } from '../../../../Endpoints';
import { APIURL } from '../../../../globals';
import { AuthenticationOutput } from '../../../models/Core/authenticationOutput';
import { ImpersonateInput } from '../../../models/Core/impersonateInput';
import { JWTTokenModel } from '../../../models/Core/jWTTokenModel';
import { FloatSelectControl } from '../../../common/floatselectcontrol';
import { ListUserModel } from '../../../models/Core/listUserModel';

@Component({
    selector: 'app-impersonationmenu',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectButtonModule, DialogModule, PasswordModule, ButtonModule, SelectModule, TooltipModule, FloatSelectControl],
    template: `
        <div class="flex flex-col gap-2" *ngIf="!isImpersonating()">
            <span>Select a user to impersonate.</span>
            <app-floatselect [(selected)]="targetID" [options]="allUsers" (selectedChange)="impersonate()" icon="pi-user" />
        </div>
        <div class="flex flex-col gap-4" *ngIf="isImpersonating()">
            <p-button icon="pi pi-eject" severity="danger" label="Stop Impersonating" (click)="stopImpersonate()" [style]="{ width: '100%' }" />
        </div>
    `,
    host: {
        class: 'hidden absolute top-[3.25rem] right-0 w-72 p-4 card border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
    }
})
export class ImpersonationMenu {    
    targetID: string = '';
    allUsers : ListUserModel[] = []

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        if (this.isImpersonating()) return;
        this.loadAllUsers();
    }

    loadAllUsers(){
        this.allUsers = []
        this.http.get<ListUserModel[]>(APIURL + Endpoints.Core.Users.Get_AllUsers).subscribe(r => {
            this.allUsers = r;
        })
    }

    impersonate() {
        if (this.targetID == null || this.targetID == '') return;
        var token = localStorage.getItem('jwtToken');
        if (token) localStorage.setItem('impersonating', token);
        var input = {
            targetUser: this.targetID
        } as ImpersonateInput;
        this.http.post<AuthenticationOutput>(APIURL + Endpoints.Core.Authentication.Post_Impersonate, input).subscribe((c) => {
            if (c.jwtToken != '') {
                localStorage.removeItem('perms');
                const helper = new JwtHelperService();
                var result = helper.decodeToken<JWTTokenModel>(c.jwtToken);
                if (!result) return;
                if (result.role == null) result.role = [];
                var permsStr = '';
                result.role.forEach((p) => {
                    permsStr += p + ';';
                });
                localStorage.setItem('perms', permsStr);
                localStorage.setItem('jwtToken', c.jwtToken);
                window.location.replace('/platform');
            }
        });
    }

    stopImpersonate() {
        var impToken = localStorage.getItem('impersonating');
        var token = localStorage.getItem('jwtToken');
        if (token && impToken) {
            localStorage.removeItem('perms');
            const helper = new JwtHelperService();
            var result = helper.decodeToken<JWTTokenModel>(impToken);
            if (!result) return;
            if (result.role == null) result.role = [];
            var permsStr = '';
            result.role.forEach((p) => {
                permsStr += p + ';';
            });
            localStorage.setItem('perms', permsStr);
            localStorage.setItem('jwtToken', impToken);
            localStorage.removeItem('impersonating');
            window.location.replace('/platform');
        }
    }

    isImpersonating(): boolean {
        if (localStorage.getItem('impersonating')) return true;
        return false;
    }
}
