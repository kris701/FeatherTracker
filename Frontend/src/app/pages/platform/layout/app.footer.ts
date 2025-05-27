import { Component } from '@angular/core';
import { JWTTokenHelpers } from '../helpers/jwtTokenHelpers';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [TagModule, CommonModule],
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Kristian Skov © 2025
        <p-tag severity="success" value="Staff Mode" *ngIf="isStaff" />
        <p-tag severity="warn" value="Impersonating user" *ngIf="isImpersonating" />
    </div>`
})
export class AppFooter {
    isStaff: boolean = false;
    isImpersonating: boolean = false;

    ngOnInit() {
        this.isStaff = JWTTokenHelpers.IsStaff();
        if (localStorage.getItem('impersonating')) this.isImpersonating = true;
    }
}
