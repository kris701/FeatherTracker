import { Injectable } from "@angular/core";
import { Endpoints } from "../../../../../../Endpoints";
import { BaseListService } from "../../../../../common/interfaces/baseListService";
import { BirdModel } from "../../../../../models/COR/birdModel";
import { ListBirdModel } from "../../../../../models/COR/listBirdModel";

@Injectable()
export class BirdsService extends BaseListService<BirdModel, ListBirdModel> {
    public override getAllEndpoint: string = Endpoints.COR.Birds.Get_AllBirds;
    public override getEndpoint: string = Endpoints.COR.Birds.Get_Bird;
}
