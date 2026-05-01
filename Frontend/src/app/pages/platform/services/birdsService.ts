import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "../../../../Endpoints";
import { environment } from "../../../../environments/environment";
import { BirdModel } from "../../../models/COR/birdModel";
import { ListBirdModel } from "../../../models/COR/listBirdModel";

@Injectable()
export class BirdsService {
    public birds : BirdModel[] = [];

    public onUpdated : EventEmitter<boolean> = new EventEmitter<boolean>();

    isLoading : boolean = false;

    constructor(
        private http: HttpClient
    ) {
    }

    public async Load(){
        if (!this.isLoading){
            this.isLoading = true;
            var groups = []
            var all = await firstValueFrom(this.http.get<ListBirdModel[]>(environment.APIURL + Endpoints.COR.Birds.Get_AllBirds));
            for(var item of all)
                groups.push(await firstValueFrom(this.http.get<BirdModel>(environment.APIURL + Endpoints.COR.Birds.Get_Bird + "?ID=" + item.id)))
            this.birds = groups;
            this.isLoading = false;
            this.onUpdated.emit(true);
        }
    }
}
