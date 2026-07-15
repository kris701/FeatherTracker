import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from '../../../../../Endpoints';
import { LayoutService } from '../../../../common/services/layoutService';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [FormsModule, RouterModule, TuiHeader, TuiTitle, TuiCardLarge],
    template: `
        <div class="flex h-full w-full items-center">
			<div tuiCardLarge>
				<header tuiHeader>
					<h1 tuiTitle style="text-align:center">
						<img class="mb-2 w-64 shrink-0 mx-auto" src="logo.png" />
						Feather Tracker!
						<span tuiSubtitle>Keeping track of your featherly friends!</span>
					</h1>
				</header>
			</div>
		</div>
    `,
	host:{
		class:"h-full"
	}
})
export class LandingPage {
    constructor(
        public layoutService: LayoutService,
        public http : HttpClient
    ) {}

    async ngOnInit(){
        var isSetup = await firstValueFrom(this.http.get<boolean>(Endpoints.COR.Setup.Get_IsSetup));
        if (isSetup === false)
            window.location.replace('/setup');
    }
}
