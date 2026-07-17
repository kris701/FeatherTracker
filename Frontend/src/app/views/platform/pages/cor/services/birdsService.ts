import { Injectable } from "@angular/core";
import { BaseListService } from "@kris701/ez-ui";
import { Endpoints } from "../../../../../../Endpoints";
import { BirdModel } from "../../../../../models/COR/birdModel";
import { ListBirdModel } from "../../../../../models/COR/listBirdModel";

@Injectable()
export class BirdsService extends BaseListService<BirdModel, ListBirdModel> {
    public override getAllEndpoint: string = Endpoints.COR.Birds.Get_AllBirds;
    public override getEndpoint: string = Endpoints.COR.Birds.Get_Bird;
}
