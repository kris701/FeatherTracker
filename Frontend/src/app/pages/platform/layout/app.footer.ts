import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Feather Tracker © 2026
    </div>`,
    styles: `
        .layout-footer {
            display: flex;
            align-items: center;
            height:4rem;
            justify-content: center;
            padding: 1rem 0 1rem 0;
            gap: 0.5rem;
            border-top: 1px solid var(--surface-border);
        }
    `
})
export class AppFooter {
}
