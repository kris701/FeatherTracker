import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-createdupdated',
    imports: [CommonModule, TooltipModule],
    template: `
        <div class="flex items-center gap-2">
            @if (createdAt && createdAt != '') {
                <span class="text-surface-500 pi pi-check-square" pTooltip="Created on {{ createdAt | date: 'dd/MM/yyyy HH:mm:ss' }}"></span>
            }
            @if (updatedAt && updatedAt != '') {
                <span class="text-surface-500 pi pi-pen-to-square" pTooltip="Updated on {{ updatedAt | date: 'dd/MM/yyyy HH:mm:ss' }}"></span>
            }
        </div>
    `
})
export class CreatedUpdatedControl {
    @Input() createdAt: string | Date | null = null;
    @Input() updatedAt: string | Date | null = null;
}
