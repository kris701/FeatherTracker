import { JwtHelperService } from "@auth0/angular-jwt";
import { JWTTokenModel } from "../../../models/Core/jWTTokenModel";

export class JWTTokenHelpers
{
    public static IsTokenSet() : boolean {
        var token = localStorage.getItem("jwtToken");
        if (token)
            return true;
        return false;
    }

    public static ClearToken() {
        localStorage.removeItem('jwtToken');
    }

    public static IsExpired() : boolean{
        var token = localStorage.getItem("jwtToken");
        if (token){
            const helper = new JwtHelperService();
            var result = helper.decodeToken<JWTTokenModel>(token);
            if (result)
            {
                var date = new Date();
                var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                    date.getUTCDate(), date.getUTCHours(),
                    date.getUTCMinutes(), date.getUTCSeconds());
                if (now_utc >= (result.exp * 1000))
                    return true;
            }
        }
        return false;
    }
}