import { HttpClient } from '@angular/common/http';
import { Directive, signal } from '@angular/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiNotificationService } from '@taiga-ui/core';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { firstValueFrom, switchMap } from 'rxjs';

@Directive()
export abstract class BaseCRUDInterface {
    public isLoading = signal<boolean>(false);

    public allItems = signal<any[]>([]);
    public currentItem = signal<any>({} as any);
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

    public showDialog = signal<boolean>(false);

    public loadOnInit: boolean = true;

    public showDeleteDialog: boolean = true;
    public deleteDialogMessage : string = "Are you sure you want to delete this item?";
    public showSaveDialog: boolean = false;
    public savewDialogMessage : string = "Are you sure you want to save this item?";

    constructor(
        public http: HttpClient,
        public messageService: TuiNotificationService,
        public confirmationService: TuiResponsiveDialogService
    ) {}

    async ngOnInit() {
        if (this.canRead && this.loadOnInit) await this.loadItems();
    }

    public async loadItems() {
        if (!this.canRead) throw new Error('You do not have read permissions!');
        this.isLoading.set(true);
        try {
            this.allItems.set(await firstValueFrom(this.http.get<any[]>(this.getAllEndpoint)));
        } catch {
			this.messageService.open("Failed to load all items!", {
				label: "Load Error",
				appearance: 'negative',
				icon:'circle-x',
				autoClose: 10000
			}).subscribe();
        }
        this.isLoading.set(false);
    }

    async saveItem() {
        if (!this.canWrite) throw new Error('You do not have write permissions!');

        if (this.showSaveDialog){
			this.confirmationService.open<boolean>(
				TUI_CONFIRM,
				{
					label: this.savewDialogMessage,
					size: 's'
				})
				.pipe(switchMap(async (response) => {
					if (response === true)
						await this.saveItemInner();
				}))
	            .subscribe();
        }
        else
            await this.saveItemInner();
    }

    async saveItemInner(){
        this.isLoading.set(true);
        try {
            var current = this.currentItem();
            if (current.id != '') {
                await firstValueFrom(this.http.patch(this.patchEndpoint, current));
				this.messageService.open("The item was updated with the new values", {
					label: "Item Updated",
					appearance: 'positive',
					icon:'circle-x',
					autoClose: 1000
				}).subscribe();
            } else {
                await firstValueFrom(this.http.post(this.postEndpoint, current));
				this.messageService.open("A new items was created", {
					label: "Item Created",
					appearance: 'positive',
					icon:'circle-x',
					autoClose: 1000
				}).subscribe();
            }
            this.showDialog.set(false);
            await this.loadItems();
        } catch {
			this.messageService.open("Save failed!", {
				label: "Save Error",
				appearance: 'negative',
				icon:'circle-x',
				autoClose: 10000
			}).subscribe();
        }
        this.isLoading.set(false);
    }

    async deleteItem() {
        if (!this.canWrite) throw new Error('You do not have write permissions!');

        if (this.showDeleteDialog){
			this.confirmationService.open<boolean>(
				TUI_CONFIRM,
				{
					label: this.deleteDialogMessage,
					size: 's'
				})
				.pipe(switchMap(async (response) => {
					if (response === true)
						await this.deleteItemInner();
				}))
	            .subscribe();
        }
        else
            await this.deleteItemInner();
    }

    async deleteItemInner() {
        this.isLoading.set(true);
        try {
            await firstValueFrom(this.http.delete(this.deleteEndpoint + '?ID=' + this.currentItem().id));
			this.messageService.open("The item was successfully deleted", {
				label: "Item Deleted",
				appearance: 'positive',
				icon:'circle-x',
				autoClose: 1000
			}).subscribe();
            this.showDialog.set(false);
            await this.loadItems();
        } catch {
			this.messageService.open("Delete failed!", {
				label: "Delete Error",
				appearance: 'negative',
				icon:'circle-x',
				autoClose: 10000
			}).subscribe();
        }
        this.isLoading.set(false);
    }

    public async showEditItem(id: string) {
        if (!this.canRead) throw new Error('You do not have read permissions!');
        this.isLoading.set(true);
        try {
            var fetched = await firstValueFrom(this.http.get<any>(this.getEndpoint + '?ID=' + id));
            this.currentItem.set(fetched);
            this.showDialog.set(true);
        } catch {
			this.messageService.open("Loading failed!", {
				label: "Load Error",
				appearance: 'negative',
				icon:'circle-x',
				autoClose: 10000
			}).subscribe();
        }
        this.isLoading.set(false);
    }

    public async showAddItem() {
        this.currentItem.set(this.newItemTemplate());
        this.showDialog.set(true);
    }
}
