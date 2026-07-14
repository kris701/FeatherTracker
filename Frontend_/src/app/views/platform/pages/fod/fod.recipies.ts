import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiButton, TuiInput, TuiLoader, TuiNotificationService } from '@taiga-ui/core';
import { TuiInputNumber } from '@taiga-ui/kit';
import { Endpoints } from '../../../../../Endpoints';
import { FloatMarkdownEditor } from "../../../../common/components/floatmarkdowneditor";
import { FloatMultiSelect } from "../../../../common/components/floatmultiselect";
import { BaseCRUDInterface } from '../../../../common/interfaces/baseCRUDInterface';
import { RecipieModel } from '../../../../models/FOD/recipieModel';
import { BirdsService } from '../cor/services/birdsService';
import { RecipiesService } from './services/recipiesService';

@Component({
    selector: 'app-fod-recipies',
    imports: [
    FormsModule,
    CommonModule,
    FloatMarkdownEditor,
    TuiLoader,
    TuiInput,
    TuiButton,
    TuiInputNumber,
    FloatMultiSelect
],
    template: `
		<tui-loader class="h-full" [overlay]="true" [loading]="isLoading()">
			@let current = currentItem();
			<div class="flex flex-col gap-2 w-full h-full">
				<tui-textfield tuiTextfieldSize="m" iconStart="square-pen">
					<label tuiLabel>Name</label>
					<input
						tuiInput
						id="recipiename"
						[(ngModel)]="current.name"
					/>
				</tui-textfield>
				<div class="flex flex-row gap-2 w-full">
					<tui-textfield tuiTextfieldSize="m" class="w-full" iconStart="weight-tilde">
						<label tuiLabel>Quantity</label>
						<input
							tuiInputNumber
							id="recipiequantity"
							[(ngModel)]="current.quantity"
						/>
					</tui-textfield>
					<tui-textfield tuiTextfieldSize="m" class="w-full" iconStart="ruler">
						<label tuiLabel>Unit</label>
						<input
							tuiInput
							id="recipieunit"
							[(ngModel)]="current.unit"
						/>
					</tui-textfield>
				</div>

				<app-floatmultiselect
					[options]="birdsService.items()"
					[(selected)]="current.birds"
					label="For Birds"
					optionLabel="name"
					optionValue="id"
					icon="bird"
				/>

				<app-floatmarkdowneditor [(value)]="current.recipie"/>

				<div class="flex flex-row gap-2 items-center" style="min-height:3rem">
					<button tuiButton size="s" iconStart="save" (click)="saveItem()">Save</button>
					@if(current.id != ''){
						<button tuiButton size="s" iconStart="x" severity="danger" (click)="deleteItem()">Delete</button>
					}
				</div>
			</div>
		</tui-loader>
    `,
    host: {
        class: 'base-view'
    }
})
export class FODRecipies extends BaseCRUDInterface {
    override newItemTemplate(): any {
        return {
            id:'',
            name: 'New Recipie',
            recipie: 'description',
            quantity: 1,
            unit: 'batch',
            birds: [] as string[]
        } as RecipieModel;
    }

    route = inject(ActivatedRoute);
    loadedQueryOnce: boolean = false;
    constructor(
        http: HttpClient,
        service: TuiNotificationService,
        confirmationService: TuiResponsiveDialogService,
        public birdsService : BirdsService,
        public recipiesService : RecipiesService,
        private router: Router
    ){
        super(http,service,confirmationService);
        router.events.subscribe(async (val) => {
            if (val instanceof NavigationEnd){
                this.loadedQueryOnce = false;
                await this.processQueryParameters();
            }
        })
    }

    override async ngOnInit(){
        await this.processQueryParameters();
        await super.ngOnInit();
    }

    async processQueryParameters() {
        if (this.loadedQueryOnce) return;
        this.loadedQueryOnce = true;
        if (this.route.snapshot.queryParamMap.has('id')) {
            var targetID = this.route.snapshot.queryParamMap.get('id');
            if (targetID) {
                await this.showEditItem(targetID);
            }
        } else if (this.route.snapshot.queryParamMap.has('add')){
            await this.showAddItem();
        }
    }

    override loadOnInit: boolean = false;
    override getAllEndpoint: string = Endpoints.FOD.Get_AllRecipies;
    override getEndpoint: string = Endpoints.FOD.Get_Recipie;
    override patchEndpoint: string = Endpoints.FOD.Patch_UpdateRecipie;
    override postEndpoint: string = Endpoints.FOD.Post_AddRecipie;
    override deleteEndpoint: string = Endpoints.FOD.Delete_Recipie;

    override async saveItem() {
        await super.saveItem();
        await this.recipiesService.Load();
    }

    override async deleteItemInner() {
        await super.deleteItemInner();
        await this.recipiesService.Load();
        this.router.navigate(['/platform']);
    }
}
