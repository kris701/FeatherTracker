import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiRoot } from "@taiga-ui/core";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, TuiRoot],
    template: `
		<tui-root class="rootContainer"><router-outlet></router-outlet></tui-root>
    `,
	styles: `
		::ng-deep .rootContainer .t-root-content {
			display:flex;
			height:100vh;
			width:100vw;
		}
	`
})
export class AppComponent {
}
