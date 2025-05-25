import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../../../../Endpoints';
import { APIURL } from '../../../../globals';
import { UserModel } from '../../../models/Core/userModel';
import { Injectable } from '@angular/core';

@Injectable()
export class UserInterface {
    public allUsers: UserModel[] = [];

    loaded: boolean = false;
    loading: boolean = false;

    constructor(private http: HttpClient) {
        this.loadAllUsers();
    }

    public RefreshUsers() {
        this.loadAllUsers();
    }

    public GetUserNameByID(id: string | null): string {
        if (id == undefined || id == null || id == '') return 'None';
        if (!this.loaded) this.loadAllUsers();
        var user = this.allUsers.find((x) => x.id == id) as UserModel;
        if (user) 
            return user.firstName + ' ' + user.lastName;
        return 'Unknown User';
    }

    loadAllUsers() {
        if (this.loading) return;
        this.loaded = false;
        this.loading = true;
        this.allUsers = [];
        this.http.get<UserModel[]>(APIURL + Endpoints.Core.Users.Get_AllUsers).subscribe(
            (l) => {
                this.allUsers = l;
                this.loaded = true;
                this.loading = false;
            },
            (e) => (this.loading = false)
        );
    }
}
