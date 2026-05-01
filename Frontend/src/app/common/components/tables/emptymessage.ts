import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'td[emptymessage]',
    imports: [CommonModule, TableModule],
    template: ` <ng-content></ng-content> `,
    host: {
        class: 'text-surface-500 text-center p-2 w-full',
        colspan: '9999'
    }
})
export class TableEmptyMessage {}
