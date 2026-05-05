import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "../../../../Endpoints";
import { ListRecipieModel } from "../../../models/FOD/listRecipieModel";

@Injectable()
export class RecipiesService {
    public recipies : ListRecipieModel[] = [];

    public onUpdated : EventEmitter<boolean> = new EventEmitter<boolean>();

    isLoading : boolean = false;

    constructor(
        private http: HttpClient
    ) {
    }

    public async Load(){
        if (!this.isLoading){
            this.isLoading = true;
            this.recipies = await firstValueFrom(this.http.get<ListRecipieModel[]>(Endpoints.FOD.Get_AllRecipies));
            this.isLoading = false;
            this.onUpdated.emit(true);
        }
    }
}
