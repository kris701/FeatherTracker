import { Component } from '@angular/core';
import { JWTTokenHelpers } from '../helpers/jwtTokenHelpers';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [TagModule, CommonModule],
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Company Name © 2025
        <p-tag severity="warn" value="Impersonating user" *ngIf="isImpersonating" />
    </div>`
})
export class AppFooter {
    isImpersonating: boolean = false;

    ngOnInit() {
        if (localStorage.getItem('impersonating')) this.isImpersonating = true;
    }
}
