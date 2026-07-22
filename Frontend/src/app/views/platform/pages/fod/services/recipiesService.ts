import { Injectable } from "@angular/core";
import { BaseListInterface } from "@kris701/ez-ui";
import { Endpoints } from "../../../../../../Endpoints";
import { ListRecipieModel } from "../../../../../models/FOD/listRecipieModel";
import { RecipieModel } from "../../../../../models/FOD/recipieModel";

@Injectable()
export class RecipiesService extends BaseListInterface<RecipieModel, ListRecipieModel> {
	public override getAllEndpoint: string = Endpoints.FOD.Get_AllRecipies;
	public override getEndpoint: string = Endpoints.FOD.Get_Recipie;
}
