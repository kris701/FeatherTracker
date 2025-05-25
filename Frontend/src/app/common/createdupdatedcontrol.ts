import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-createdupdated',
    imports: [CommonModule, TooltipModule],
    template: `
        <div class="flex items-center gap-2">
            @if (haveBeenCreated()) {
                <span class="text-surface-500 pi pi-check-square" pTooltip="Created on {{ prettyDate(createdAt) }}"></span>
            }
            @if (haveBeenEdited()) {
                <span class="text-surface-500 pi pi-pen-to-square" pTooltip="Updated on {{ prettyDate(updatedAt) }}"></span>
            }
        </div>
    `
})
export class CreatedUpdatedControl {
    @Input() createdAt: string | Date | null = null;
    @Input() updatedAt: string | Date | null = null;

    haveBeenCreated() {
        return this.createdAt != null && this.createdAt != '';
    }

    haveBeenEdited() {
        return this.updatedAt != null && this.updatedAt != '';
    }

    prettyDate(input: string | Date | null): string {
        if (input == null || input == '') return 'Never';
        return new Date(Date.parse(<string>input)).toLocaleString();
    }
}
