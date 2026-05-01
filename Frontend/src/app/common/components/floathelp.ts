import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'app-floathelp',
    imports: [CommonModule, ButtonModule, DrawerModule],
    template: `
        <div class="flex" style="flex-direction:row-reverse;position:relative;top:-1.5rem;right:-1.5rem;margin-bottom:-2.5rem;z-index:10">
            <p-button icon="pi pi-question-circle" severity="info" text  (click)="visible = true" />
            <p-drawer [(visible)]="visible" [header]="header" appendTo="body" position="bottom" [style]="{ 'min-height': '50vh' }">
                <ng-content></ng-content>
            </p-drawer>
        </div>
    `
})
export class FloatHelp {
    visible: boolean = false;

    @Input() header = 'Help';
}
