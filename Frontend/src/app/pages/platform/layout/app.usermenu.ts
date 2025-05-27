import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { Endpoints } from '../../../../Endpoints';
import { APIURL } from '../../../../globals';
import { PermissionsTable } from '../../../../PermissionsTable';
import { FloatTextInput } from '../../../common/floattextinput';
import { UpdatePasswordInput } from '../../../models/Core/updatePasswordInput';
import { UserModel } from '../../../models/Core/userModel';
import { JWTTokenHelpers } from '../helpers/jwtTokenHelpers';
import { PermissionHelpers } from '../helpers/permissionHelpers';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
    selector: 'app-usermenu',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SelectButtonModule,
        DialogModule,
        PasswordModule,
        ButtonModule,
        FloatLabelModule,
        MultiSelectModule,
        InputTextModule,
        TooltipModule,
        ChipModule,
        FloatTextInput,
        FieldsetModule
    ],
    template: `
        <div class="flex flex-col gap-2">
            <p-button icon="pi pi-asterisk" label="Change Password" pTooltip="Change your password" (click)="showChangePassword()" [style]="{ width: '100%' }" [hidden]="!canWriteSelf" />
            <p-button icon="pi pi-user-edit" label="Profile" pTooltip="View and edit profile" (click)="showEditProfile()" [style]="{ width: '100%' }" />
            <p-button icon="pi pi-sign-out" label="Log Out" severity="danger" pTooltip="Log out and return to the login screen" (click)="logOut()" [disabled]="isImpersonating" [style]="{ width: '100%' }" />

            <p-dialog header="Change Password" [(visible)]="changePasswordVisible" [style]="{ width: '30vw' }" [modal]="true">
                <div class="card flex flex-col gap-2">
                    <p-password id="password1" [(ngModel)]="oldPassword" placeholder="Old Password" [toggleMask]="true" styleClass="mb-1" [fluid]="true" [feedback]="false"></p-password>
                    <p-password id="password2" [(ngModel)]="newPassword1" placeholder="New Password" [toggleMask]="true" styleClass="mb-1" [fluid]="true" [feedback]="true"></p-password>
                    <p-password id="password3" [(ngModel)]="newPassword2" placeholder="Repeat new Password" [toggleMask]="true" styleClass="mb-1" [fluid]="true" [feedback]="true"></p-password>
                </div>
                <ng-template #footer>
                    <p-button label="Save" icon="pi pi-save" (click)="changePassword()" />
                </ng-template>
            </p-dialog>

            <p-dialog header="Profile" [(visible)]="editProfileVisible" [breakpoints]="{ '960px': '95vw' }" [style]="{ width: '50vw' }" [modal]="true">
                <div class="card flex flex-col gap-2">
                    <p>Here you can view and modify your current profile information</p>
                    <p-fieldset legend="Login Information">
                        <div class="flex flex-col gap-2">
                            <p>Your login name must be unique!</p>
                            <app-floattextinput [(value)]="currentUser.loginName" [disabled]="!canWriteSelf" label="Login Name" icon="pi-sign-in" />
                        </div>
                    </p-fieldset>
                    <p-fieldset legend="General Information">
                        <div class="flex flex-col gap-2">
                            <app-floattextinput [(value)]="currentUser.firstName" [disabled]="!canWriteSelf" label="First Name" icon="pi-pencil" />
                            <app-floattextinput [(value)]="currentUser.lastName" [disabled]="!canWriteSelf" label="Last Name" icon="pi-pencil" />
                            <app-floattextinput [(value)]="currentUser.email" [disabled]="!canWriteSelf" label="E-Mail" icon="pi-envelope" />
                        </div>
                    </p-fieldset>
                </div>
                <ng-template #footer>
                    <p-button label="Save" icon="pi pi-save" (click)="updateUser()" [hidden]="!canWriteSelf" />
                </ng-template>
            </p-dialog>
        </div>
    `,
    host: {
        class: 'hidden absolute top-[3.25rem] right-0 w-72 p-4 card border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
    }
})
export class UserMenu {
    changePasswordVisible: boolean = false;
    oldPassword: string = '';
    newPassword1: string = '';
    newPassword2: string = '';

    canWriteSelf: boolean = PermissionHelpers.HasPermission(PermissionsTable.Core_Users_Own_Write);
    isImpersonating: boolean = localStorage.getItem('impersonating') ? true : false;

    editProfileVisible: boolean = false;
    currentUser: UserModel = {} as UserModel;

    constructor(
        private router: Router,
        private http: HttpClient,
        private service: MessageService
    ) {}

    ngOnInit() {
        this.http.get<UserModel>(APIURL + Endpoints.Core.Users.Get_User + '?ID=' + JWTTokenHelpers.GetUserID()).subscribe((r) => {
            this.currentUser = r;
        });
    }

    logOut() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('perms');
        this.router.navigate(['/']);
    }

    showChangePassword() {
        this.changePasswordVisible = true;
    }

    changePassword() {
        if (this.newPassword1 != this.newPassword2) {
            alert('New passwords are not identical!');
            return;
        }

        var input = {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword1
        } as UpdatePasswordInput;
        this.http.patch<UpdatePasswordInput>(APIURL + Endpoints.Core.Users.Patch_UpdatePassword, input).subscribe(() => {
            this.router.navigate(['/platform/auth/login']);
        });
    }

    showEditProfile() {
        this.editProfileVisible = true;
    }

    updateUser() {
        this.http.patch<UserModel>(APIURL + Endpoints.Core.Users.Patch_UpdateUser, this.currentUser).subscribe(() => {
            this.editProfileVisible = false;
            this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Profile updated!' });
        });
    }
}
