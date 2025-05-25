import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Endpoints } from '../../../../../../Endpoints';
import { APIURL } from '../../../../../../globals';
import { BooleanLabelControl } from '../../../../../common/booleanlabelcontrol';
import { FieldsetModule } from 'primeng/fieldset';
import { CreatedUpdatedControl } from '../../../../../common/createdupdatedcontrol';
import { FloatTextInput } from '../../../../../common/floattextinput';
import { ToggleSwitchLabel } from '../../../../../common/toggleswitchlabel';
import { PermissionModel } from '../../../../../models/Core/permissionModel';
import { UserModel } from '../../../../../models/Core/userModel';
import { JWTTokenHelpers } from '../../../helpers/jwtTokenHelpers';
import { UserInterface } from '../../../interfaces/usersinterface';
import { PermissionsEditor } from './permissionsEditor';
import { ConfirmDialogHelpers } from '../../../helpers/confirmdialoghelpers';
import { AddUserInput } from '../../../../../models/Core/addUserInput';

@Component({
    selector: 'app-company-components-usereditor',
    imports: [
        FormsModule,
        CommonModule,
        DialogModule,
        ButtonModule,
        FloatLabelModule,
        InputTextModule,
        MultiSelectModule,
        PasswordModule,
        TableModule,
        ChipModule,
        TooltipModule,
        ConfirmDialogModule,
        TagModule,
        FloatTextInput,
        ToggleSwitchLabel,
        BooleanLabelControl,
        CreatedUpdatedControl,
        PermissionsEditor,
        FieldsetModule
    ],
    template: `
        <p-table [value]="allUsers" [scrollable]="true" styleClass="mt-4" [loading]="isLoading">
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <p-button icon="pi pi-plus" label="Add User" rounded raised (click)="showAddUser()" [hidden]="!canWrite" />
                    <p-button icon="pi pi-refresh" rounded raised (click)="loadUsers()" />
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th class="font-bold">Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Is Active?</th>
                </tr>
            </ng-template>
            <ng-template #body let-user>
                <tr (click)="showEditUser(user.id)" class="rowclickable">
                    <td class="font-bold">{{ user.firstName }} {{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phoneNumber }}</td>
                    <td><app-booleanlabel [value]="user.isActive" /></td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="showDialog" [breakpoints]="{ '960px': '95vw' }" [style]="{ width: '50vw' }" [modal]="true" [draggable]="false">
            <ng-template #header>
                <div class="inline-flex items-center justify-center gap-2">
                    <span class="font-bold whitespace-nowrap">{{ currentUser.loginName }}</span>
                    <app-createdupdated [createdAt]="currentUser.createdAt" [updatedAt]="currentUser.updatedAt" />
                </div>
            </ng-template>
            <div class="card flex flex-col gap-2">
                <app-toggleswitchlabel [(value)]="currentUser.isActive" label="Is Active?" [disabled]="!canWrite" [hidden]="!canWrite" class="w-full " />

                <p-fieldset legend="Login Information">
                    <div class="flex flex-col gap-2">
                        <p>The login name must be unique!</p>
                        <app-floattextinput [(value)]="currentUser.loginName" [disabled]="!canWrite" label="Login Name" icon="pi-sign-in" />
                        @if (currentUser.id == '') {
                            <div class="gap-2">
                                <p-password id="password1" [(ngModel)]="newPassword1" placeholder="Password" [toggleMask]="true" styleClass="mb-1" [fluid]="true" [feedback]="true"></p-password>
                                <p-password id="password2" [(ngModel)]="newPassword2" placeholder="Repeat Password" [toggleMask]="true" styleClass="mb-1" [fluid]="true" [feedback]="true"></p-password>
                            </div>
                        }
                    </div>
                </p-fieldset>
                <p-fieldset legend="General Information">
                    <div class="flex flex-col gap-2">
                        <app-floattextinput [(value)]="currentUser.firstName" [disabled]="!canWrite" label="First Name" icon="pi-pencil" />
                        <app-floattextinput [(value)]="currentUser.lastName" [disabled]="!canWrite" label="Last Name" icon="pi-pencil" />
                        <app-floattextinput [(value)]="currentUser.email" [disabled]="!canWrite" label="E-Mail" icon="pi-envelope" />
                        <app-floattextinput [(value)]="currentUser.phoneNumber" [disabled]="!canWrite" label="Phone Number" icon="pi-phone" />
                    </div>
                </p-fieldset>

                <p-fieldset legend="Permissions">
                    <div class="flex flex-col gap-2">
                        <app-company-components-permissionseditor [options]="permissionsList" [(selected)]="currentUser.permissions" />
                    </div>
                </p-fieldset>
            </div>
            <ng-template #footer>
                <p-button label="Save" icon="pi pi-save" (click)="saveUser()" [hidden]="!canWrite" />
                <p-confirmdialog />
                <p-button icon="pi pi-times" label="Delete" severity="danger" [disabled]="cannotDelete(currentUser.id)" (click)="deleteUser(currentUser.id)" [hidden]="!canWrite"></p-button>
            </ng-template>
        </p-dialog>
    `
})
export class UserEditor {
    newPassword1: string = '';
    newPassword2: string = '';
    permissionsList: PermissionModel[] = [];
    isLoading: boolean = true;

    @Input() canRead: boolean = false;
    @Input() canWrite: boolean = false;
    @Input() canReadPermissions: boolean = false;

    showDialog: boolean = false;

    allUsers: UserModel[] = [];
    currentUser: UserModel = {} as UserModel;

    constructor(
        private http: HttpClient,
        private service: MessageService,
        private confirmationService: ConfirmationService,
        private userInterface: UserInterface
    ) {}

    loadAll() {
        if (this.canReadPermissions) this.loadPermissions();
        if (this.canRead) this.loadUsers();
    }

    cannotDelete(userID: string): boolean {
        if (this.allUsers.length == 1) return true;
        if (JWTTokenHelpers.GetUserID() == userID) return true;
        return false;
    }

    showAddUser() {
        this.currentUser = {
            id: '',
            loginName: 'newusername',
            firstName: 'New',
            lastName: 'User',
            email: 'None',
            phoneNumber: 'None',
            isActive: true
        } as UserModel;
        this.showDialog = true;
    }

    showEditUser(userID: string) {
        this.http.get<UserModel>(APIURL + Endpoints.Core.Users.Get_User + '?ID=' + userID).subscribe((u) => {
            this.currentUser = u;
            this.showDialog = true;
        });
    }

    deleteUser(userID: string) {
        this.confirmationService.confirm({
            ...ConfirmDialogHelpers.DeleteContent(),
            message: 'Are you sure you want to delete this user?',
            accept: () => {
                this.http.delete(APIURL + Endpoints.Core.Users.Delete_User + '?ID=' + userID).subscribe(() => {
                    this.service.add({ severity: 'info', summary: 'Info Message', detail: 'User deleted!' });
                    this.showDialog = false;
                    this.loadUsers();
                    this.userInterface.RefreshUsers();
                });
            }
        });
    }

    loadUsers() {
        this.isLoading = true;
        this.http.get<UserModel[]>(APIURL + Endpoints.Core.Users.Get_AllUsers).subscribe((l) => {
            this.isLoading = false;
        });
    }

    loadPermissions() {
        this.permissionsList = [];
        this.http.get<PermissionModel[]>(APIURL + Endpoints.Core.Authentication.Get_AllPermissions).subscribe((l) => {
            this.permissionsList = l;
        });
    }

    saveUser() {
        if (this.currentUser.id == '') {
            if (this.newPassword1 != this.newPassword2) {
                alert('New passwords are not identical!');
                return;
            }
            if (this.newPassword1 == '') {
                alert('New users must have a set password!');
                return;
            }

            var inputModel = {
                ...this.currentUser,
                password: this.newPassword1
            } as AddUserInput;

            this.http.post<UserModel>(APIURL + Endpoints.Core.Users.Post_AddUser, inputModel).subscribe(() => {
                this.showDialog = false;
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'User created!' });
                this.loadUsers();
                this.userInterface.RefreshUsers();
            });
        } else {
            this.http.patch<UserModel>(APIURL + Endpoints.Core.Users.Patch_UpdateUser, this.currentUser).subscribe(() => {
                this.showDialog = false;
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'User updated!' });
                this.loadUsers();
                this.userInterface.RefreshUsers();
            });
        }
    }
}
