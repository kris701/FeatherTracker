import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { BooleanLabelControl } from '../booleanlabelcontrol';

@Component({
    selector: 'td[daterow]',
    imports: [CommonModule, TagModule],
    template: ` {{ value == null ? 'Never' : (value | date: 'dd/MM/yyyy') }} `
})
export class TableDateRow {
    @Input() value: string | Date | null = '';
}

@Component({
    selector: 'td[datetimerow]',
    imports: [CommonModule, TagModule],
    template: ` {{ value == null ? 'Never' : (value | date: 'dd/MM/yyyy HH:mm:ss') }} `
})
export class TableDateTimeRow {
    @Input() value: string | Date | null = '';
}

@Component({
    selector: 'td[tagrow]',
    imports: [CommonModule, TagModule],
    template: ` <p-tag [severity]="severity">{{ value }}</p-tag> `
})
export class TableTagRow {
    @Input() value: string | null | undefined = '';
    @Input() severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined | null = 'secondary';
}

@Component({
    selector: 'td[boolrow]',
    imports: [CommonModule, TagModule, BooleanLabelControl],
    template: ` <app-booleanlabel [value]="value" /> `
})
export class TableBoolRow {
    @Input() value: boolean = false;
}
