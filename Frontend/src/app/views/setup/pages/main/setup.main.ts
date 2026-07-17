import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EzUIPasswordInput, EzUITextInput } from "@kris701/ez-ui";
import { TuiButton, TuiLoader, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from '../../../../../Endpoints';
import { LayoutService } from '../../../../common/services/layoutService';
import { AuthRequest } from '../../../../models/COR/authRequest';
import { SetupInput } from '../../../../models/COR/setupInput';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [FormsModule, RouterModule, TuiHeader, TuiTitle, TuiCardLarge, TuiLoader, TuiButton, EzUITextInput, EzUIPasswordInput],
    template: `
        <div class="flex h-full w-full items-center">
			<tui-loader [overlay]="true" [loading]="isLoading()">
				<div appearance="floating" tuiCardLarge>
					<header tuiHeader style="align-self:center">
						<h2 tuiTitle style="text-align:center">
							<img src="logo.png" />
							Setup
						</h2>
					</header>

					<section class="flex flex-col gap-2">
						<span>Some small setup is required before you can start using Feather Tracker</span>
						<span>Input the username and password you would like to log in with:</span>

						<ezui-textinput label="Username" [(value)]="model.user.username"/>

						<ezui-passwordinput label="Password" [(value)]="model.user.password" />
					</section>

					<footer>
						<button tuiButton class="w-full" appearance="positive" (click)="submit()">Submit</button>
					</footer>
				</div>
			</tui-loader>
		</div>
    `,
	host:{
		class:"h-full"
	}
})
export class SetupPage {
    model : SetupInput = { user: { username: 'admin', password: 'admin' } as AuthRequest } as SetupInput;
	isLoading = signal<boolean>(false);

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient
    ) {}

    async submit(){
		this.isLoading.set(true);
        await firstValueFrom(this.http.post(Endpoints.COR.Setup.Post_Setup, this.model));
        window.location.replace('/');
    }
}
