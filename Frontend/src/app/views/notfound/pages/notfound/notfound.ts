import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, TuiCardLarge, TuiHeader, TuiTitle, TuiButton, TuiAvatar],
    template: `
        <div class="flex h-full w-full items-center">
			<div tuiCardLarge appearance="floating">
				<header tuiHeader>
					<h1 tuiTitle>
						Unknown route!
						<span tuiSubtitle>Requested resource is not available</span>
					</h1>

					<aside tuiAccessories>
						<div
							appearance="primary"
							tuiAvatar="shield-question-mark"
						></div>
					</aside>
				</header>

				<footer>
					<button
						appearance="secondary"
						size="m"
						tuiButton
						type="button"
						routerLink="/"
					>
						Home
					</button>
				</footer>
			</div>
		</div>
    `,
	host:{
		class: 'w-full h-full'
	}
})
export class Notfound {
}
