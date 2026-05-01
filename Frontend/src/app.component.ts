import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    template: `
        <p-toast position="bottom-left" />
        <router-outlet [@routeAnimations]="getRouteAnimationData()"></router-outlet>
    `
})
export class AppComponent {
    constructor(private contexts: ChildrenOutletContexts) {}

    getRouteAnimationData() {
        return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    }
}
