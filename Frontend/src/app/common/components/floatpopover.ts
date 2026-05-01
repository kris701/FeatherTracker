import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
    selector: 'app-floatpopover',
    imports: [FormsModule, CommonModule, PopoverModule],
    template: `
        <p-popover #intpopover [focusOnShow]="false">
            <ng-content></ng-content>
        </p-popover>
    `,
    styles: `
        ::ng-deep.p-popover:before,
        ::ng-deep.p-popover:after {
            display: none;
        }
    `
})
export class FloatPopover {
    @ViewChild('intpopover') intpopover!: Popover;

    public toggle(event: any) {
        this.intpopover.toggle(event);
    }
}
