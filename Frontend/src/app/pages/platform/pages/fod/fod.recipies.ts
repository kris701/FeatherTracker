import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Endpoints } from '../../../../../Endpoints';
import { FloatMarkdownEditor } from "../../../../common/components/floatmarkdowneditor";
import { FloatMultiSelect } from "../../../../common/components/floatmultiselect";
import { FloatNumberInput } from "../../../../common/components/floatnumberinput";
import { FloatTextInput } from "../../../../common/components/floattextinput";
import { BaseCRUDInterface } from '../../../../common/interfaces/baseCRUDInterface';
import { RecipieModel } from '../../../../models/FOD/recipieModel';
import { BirdsService } from '../../services/birdsService';
import { RecipiesService } from '../../services/recipiesService';

@Component({
    selector: 'app-fod-recipies',
    imports: [
    FormsModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    MultiSelectModule,
    PasswordModule,
    TableModule,
    TagModule,
    SplitterModule,
    TextareaModule,
    FloatTextInput,
    FloatMarkdownEditor,
    FloatNumberInput,
    FloatMultiSelect
],
    template: `
        <div class="flex flex-col gap-2 w-full h-full">
            <app-floattextinput [(value)]="currentItem.name" label="Name" icon="pi-pen-to-square" class="w-full"/>
            <div class="flex flex-row gap-2">
                <app-floatnumberinput [(value)]="currentItem.quantity" label="Quantity" class="w-full"/>
                <app-floattextinput [(value)]="currentItem.unit" label="Unit" class="w-full"/>
            </div>
            <app-floatmultiselect [options]="birdsService.birds" [(selected)]="currentItem.birds" optionLabel="name" optionValue="id" label="For birds"/>

            <app-floatmarkdowneditor [(value)]="currentItem.recipie"/>

            <div class="flex flex-row gap-4 items-center" style="min-height:3rem">
                <p-button label="Save" icon="pi pi-save" (click)="saveItem()" />
                <p-button icon="pi pi-times" label="Delete" severity="danger" (click)="deleteItem()" [hidden]="currentItem.id == ''"></p-button>
            </div>
        </div>
    `,
    host: {
        class: 'card flex flex-col flex-grow'
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
        service: MessageService,
        confirmationService: ConfirmationService,
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
    override loadOnChanges: boolean = false;
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
