import { HttpClient } from '@angular/common/http';
import { Directive } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogHelpers } from '../../pages/platform/helpers/confirmdialoghelpers';

@Directive()
export class BaseCRUDInterface {
    public isLoading: boolean = false;

    public allItems: any[] = [];
    public currentItem: any = {} as any;
    public newItemTemplate(): any {
        return {} as any;
    }

    public getAllEndpoint: string = '';
    public getEndpoint: string = '';
    public patchEndpoint: string = '';
    public postEndpoint: string = '';
    public deleteEndpoint: string = '';

    public canRead: boolean = true;
    public canWrite: boolean = true;

    public showDialog: boolean = false;

    public loadOnInit: boolean = true;

    public loadOnChanges: boolean = true;

    public showDeleteDialog: boolean = true;
    public deleteDialogMessage : string = "Are you sure you want to delete this item?";
    public showSaveDialog: boolean = false;
    public savewDialogMessage : string = "Are you sure you want to save this item?";

    constructor(
        public http: HttpClient,
        public service: MessageService,
        public confirmationService: ConfirmationService
    ) {}

    async ngOnInit() {
        if (this.canRead && this.loadOnInit) await this.loadItems();
    }

    public async loadItems() {
        if (!this.canRead) throw new Error('You do not have read permissions!');
        this.isLoading = true;
        try {
            this.allItems = await firstValueFrom(this.http.get<any[]>(this.getAllEndpoint));
        } catch {
            this.service.add({ severity: 'error', summary: 'Load Error', detail: 'Failed to load all items!' });
        }
        this.isLoading = false;
    }

    async saveItem() {
        if (!this.canWrite) throw new Error('You do not have write permissions!');

        if (this.showSaveDialog){
            await this.confirmationService.confirm({
                ...ConfirmDialogHelpers.SaveContent(),
                message: this.savewDialogMessage,
                accept: async () => {
                    await this.saveItemInner();
                }
            });
        }
        else
            await this.saveItemInner();
    }

    async saveItemInner(){
        this.isLoading = true;
        try {
            if (this.currentItem.id != '') {
                await firstValueFrom(this.http.patch(this.patchEndpoint, this.currentItem));
                this.service.add({ severity: 'success', summary: 'Item Updated!', detail: 'The item was updated with the new values' });
            } else {
                await firstValueFrom(this.http.post(this.postEndpoint, this.currentItem));
                this.service.add({ severity: 'success', summary: 'Item Created!', detail: 'A new items was created' });
            }
            this.showDialog = false;
            if (this.loadOnChanges)
                await this.loadItems();
        } catch {
            this.service.add({ severity: 'error', summary: 'Save Error', detail: 'Save failed!' });
        }
        this.isLoading = false;
    }

    async deleteItem() {
        if (!this.canWrite) throw new Error('You do not have write permissions!');

        if (this.showDeleteDialog){
            await this.confirmationService.confirm({
                ...ConfirmDialogHelpers.DeleteContent(),
                message: this.deleteDialogMessage,
                accept: async () => {
                    await this.deleteItemInner();
                }
            });
        }
        else
            await this.deleteItemInner();
    }

    async deleteItemInner() {
        this.isLoading = true;
        try {
            await firstValueFrom(this.http.delete(this.deleteEndpoint + '?ID=' + this.currentItem.id));
            this.service.add({ severity: 'info', summary: 'Item deleted!', detail: 'The item was successfully deleted' });
            this.showDialog = false;
            if (this.loadOnChanges)
                await this.loadItems();
        } catch {
            this.service.add({ severity: 'error', summary: 'Delete Error', detail: 'Delete failed!' });
        }
        this.isLoading = false;
    }

    public async showEditItem(id: string) {
        if (!this.canRead) throw new Error('You do not have read permissions!');
        this.isLoading = true;
        try {
            this.currentItem = await firstValueFrom(this.http.get<any>(this.getEndpoint + '?ID=' + id));
            this.showDialog = true;
        } catch {
            this.service.add({ severity: 'error', summary: 'Load Error', detail: 'Loading failed!' });
        }
        this.isLoading = false;
    }

    public async showAddItem() {
        this.currentItem = this.newItemTemplate();
        this.showDialog = true;
    }

    public showMessage(summary : string, detail: string, severity : string){
        this.service.add({ severity: severity, summary: summary, detail: detail });
    }
}
