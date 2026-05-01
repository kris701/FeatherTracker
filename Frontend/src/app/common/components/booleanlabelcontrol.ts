import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-booleanlabel',
    imports: [CommonModule],
    template: `
        @if (value) {
            <i class="pi pi-check-circle"></i>
        } @else {
            <i class="pi pi-circle-off"></i>
        }
    `
})
export class BooleanLabelControl {
    @Input() value: boolean | null | undefined = undefined;
}
