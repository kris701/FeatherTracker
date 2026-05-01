import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "../../../../Endpoints";
import { APIURL } from "../../../../globals";
import { BirdModel } from "../../../models/COR/birdModel";
import { ListBirdModel } from "../../../models/COR/listBirdModel";

@Injectable()
export class BirdsService {
    public birds : BirdModel[] = [];

    isLoaded : boolean = false;
    isLoading : boolean = false;

    constructor(
        private http: HttpClient
    ) {
    }

    public async Load(){
        if (!this.isLoaded && !this.isLoading){
            this.isLoading = true;
            var groups = []
            var all = await firstValueFrom(this.http.get<ListBirdModel[]>(APIURL + Endpoints.COR.Birds.Get_AllBirds));
            for(var item of all)
                groups.push(await firstValueFrom(this.http.get<BirdModel>(APIURL + Endpoints.COR.Birds.Get_Bird + "?ID=" + item.id)))
            this.birds = groups;
            this.isLoaded = true;
            this.isLoading = false;
        }
    }
}
