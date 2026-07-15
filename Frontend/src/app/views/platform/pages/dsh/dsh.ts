import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-dsh',
    imports: [
    CommonModule
],
    template: `
        <div>
            Welcome to Feather Tracker!
        </div>
        <div>
            <p>To start using feather tracker, navigate to the sidebar on the left side and click 'Add Bird'</p>
            <p>When you have added your bird, you can click on the bird under the 'Weight Tracking' page and start entering weights!</p>
        </div>
    `,
    host:{
        class: 'base-view gap-2'
    }
})
export class Dashboard {
}

