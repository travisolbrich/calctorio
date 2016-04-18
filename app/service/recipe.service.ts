
import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Recipe} from "../model/recipe.model";
import {Ingredient} from "../model/ingredient.model";

@Injectable()
export class RecipeService {
    constructor (private http: Http) {}

    getRecipes(url:string): Observable<Recipe[]> {
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error("Bad response status: " + res.status);
        }
        
        let body = res.json();

        let formatted: Recipe[];
        formatted = [];

        body.forEach((recipe:any) => {
            let toInsert: Recipe = {
                name: recipe.name,
                category: recipe.category || 'n/a',
                enabled: recipe.enabled,
                time: recipe.energy_required || .5,
                type: recipe.type,
                ingredients: [],
                outputCount: recipe.result_count || 1,
                ips: null
            };

            recipe.ingredients.forEach((ingredient:any) => {
                if(ingredient.type != null){
                    toInsert.ingredients.push({
                        name: ingredient.name,
                        count: ingredient.amount
                    });
                }
                else {
                    toInsert.ingredients.push({
                        name: ingredient[0],
                        count: ingredient[1]
                    });
                }
            });

            toInsert.ips = toInsert.outputCount / toInsert.time;
            formatted.push(toInsert);
        });


        console.log(formatted);
        return formatted || {};
    }

    private handleError(error: any) {
        let errMsg = error.message || 'Server Error';
        console.error(errMsg);

        return Observable.throw(errMsg);
    }
}