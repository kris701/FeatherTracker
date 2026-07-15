import { Injectable } from "@angular/core";
import { Endpoints } from "../../../../../../Endpoints";
import { BaseListService } from "../../../../../common/interfaces/baseListService";
import { ListRecipieModel } from "../../../../../models/FOD/listRecipieModel";
import { RecipieModel } from "../../../../../models/FOD/recipieModel";

@Injectable()
export class RecipiesService extends BaseListService<RecipieModel, ListRecipieModel> {
	public override getAllEndpoint: string = Endpoints.FOD.Get_AllRecipies;
	public override getEndpoint: string = Endpoints.FOD.Get_Recipie;
}
