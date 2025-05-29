import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PermissionHelpers } from '../helpers/permissionHelpers';
import { PermissionsTable } from '../../../../PermissionsTable';
import { AppMenuitem } from './app.menuitem';
import { HttpClient } from '@angular/common/http';
import { ListBirdModel } from '../../../models/Core/listBirdModel';
import { APIURL } from '../../../../globals';
import { Endpoints } from '../../../../Endpoints';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})

export class AppMenu {
    model: MenuItem[] = [];
    editBirdNode : MenuItem = {} as MenuItem;
    editBirdAddNode : MenuItem = {} as MenuItem;
    birdWeightNode : MenuItem = {} as MenuItem;
    lastUpdate : Date = new Date(-8640000000000000);

    constructor(
        private http: HttpClient
    ) {
        this.editBirdAddNode = {
            id: 'addnode',
            label: 'Add Bird',
            icon: 'pi pi-plus',
            routerLink: ['/platform/birds/editbirds'],
            queryParams: {'add':'true'},
            visible: PermissionHelpers.HasPermission(PermissionsTable.Birds_Write)
        } as MenuItem
        this.editBirdNode  = {
            label: "Edit birds",
            icon: 'pi pi-book',
            items: [
                this.editBirdAddNode
            ]
        } as MenuItem;

        this.birdWeightNode  = {
            label: "Weight Tracking",
            icon: 'pi pi-chart-line',
            items: []
        } as MenuItem;

        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-objects-column',
                        routerLink: ['/platform']
                    }
                ]
            },
            {
                label: 'Birds',
                items: [
                    this.editBirdNode,
                    this.birdWeightNode
                ]
            },
            {
                label: 'Core',
                visible: PermissionHelpers.HasPermission(PermissionsTable.Core_Users_Write),
                items: [
                    {
                        label: 'Edit Users',
                        routerLink: ['/platform/core/editusers'],
                        visible: PermissionHelpers.HasPermission(PermissionsTable.Core_Users_Write),
                        icon: 'pi pi-user'
                    }
                ]
            }
        ];
        setInterval(() => {this.loadBirds();}, 5000);
    }

    ngOnInit() {
        this.loadBirds();
    }

    public loadBirds(){
        this.http.get<ListBirdModel[]>(APIURL + Endpoints.Birds.Get_AllBirds).subscribe((l) => {
            var newest = l.map(x => new Date(<Date>x.updatedAt)).reduce((a,b) => new Date(Math.max(a.getTime(), b.getTime())))

            if (newest > this.lastUpdate){
                this.editBirdNode.items = [];
                this.birdWeightNode.items = [];
                this.editBirdNode.items?.push(this.editBirdAddNode);
                l.forEach(b => {
                    this.editBirdNode.items?.push({
                        key: b.id,
                        label: b.name,
                        routerLink: ['/platform/birds/editbirds'],
                        queryParams: {'id':b.id}
                    })
                    this.birdWeightNode.items?.push({
                        key: b.id,
                        label: b.name,
                        routerLink: ['/platform/birds/weighttracking'],
                        queryParams: {'id':b.id}
                    })
                })
                this.model = [...this.model]
                this.lastUpdate = newest;
            }
        });
    }
}
