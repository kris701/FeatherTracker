import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-dsh',
    imports: [
    CommonModule
],
    template: `
        <span>tbm</span>
    `,
    host:{
        class: 'card flex flex-col flex-grow'
    }
})
export class Dashboard {
}

