import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    template: `
        <div class="card">
            Welcome to Feather Tracker!
        </div>
    `
})
export class Dashboard {
}
