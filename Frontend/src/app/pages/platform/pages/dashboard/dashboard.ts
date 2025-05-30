import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    template: `
        <div class="card">
            Welcome to Feather Tracker!
        </div>
        <div class="card">
            <p>To start using feather tracker, navigate to the sidebar on the left side and click 'Add Bird'</p>
            <p>When you have added your bird, you can click on the bird under the 'Weight Tracking' page and start entering weights!</p>
        </div>
    `
})
export class Dashboard {
}
