import { HttpClient } from "@angular/common/http";
import { Directive, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Directive()
export class BaseListService<T,TList extends IIdentifiable> {
    public items = signal<TList[]>([]);

    public getAllEndpoint: string = '';
    public getEndpoint: string = '';

    isLoaded : boolean = false;
    isLoading : boolean = false;

    constructor(
        public http: HttpClient
    ) {
    }

    public async Load(){
        if (!this.isLoading){
            this.isLoaded = false;
            this.isLoading = true;
			var value = await firstValueFrom(this.http.get<TList[]>(this.getAllEndpoint));
            this.items.set(value);
            this.isLoading = false;
            this.isLoaded = true;
        }
    }

    public async List() : Promise<TList[]>{
        if (!this.isLoaded)
            await this.waitForValue(() => this.isLoaded === true);
        return this.items();
    }

    public async ListGet(id : string) : Promise<TList | null>{
        if (!this.isLoaded)
            await this.waitForValue(() => this.isLoaded === true);
        var target = this.items().find(x => x.id == id);
        if (target)
            return target;
        return null;
    }

    public async Get(id : string) : Promise<T> {
        var item = await firstValueFrom(this.http.get<T>(this.getEndpoint + "?ID=" + id));
        return item;
    }

    async waitForValue(test : any) {
        const delayMs = 500;
        while(!test()) await new Promise(resolve => setTimeout(resolve, delayMs));
    }
}

export interface IIdentifiable {
    id : string;
}
