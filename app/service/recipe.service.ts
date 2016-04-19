
import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Recipe} from "../model/recipe.model";
import {Ingredient} from "../model/ingredient.model";
import {Result} from "../model/result.model";

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
            let toInsert: Recipe = new Recipe(
                recipe.type,
                recipe.name,
                recipe.energy_required || .5,
                [],
                recipe.category || 'n/a',
                recipe.enabled
            );

            // TODO: Should this actually be in the model?
            // Some of the recipes (especially chemical ones) can have multiple results
            if(recipe.results) {
                let results:Result[] = recipe.results.filter((result: Result) => {
                    return result.name == recipe.name;
                });

                if(results.length == 1){
                    toInsert.outputCount = results[0].amount;
                    console.debug("Setting outputCount to " + toInsert.outputCount + " for " + toInsert.name);
                } else {
                    toInsert.outputCount = 1;
                    console.debug("Couldn't find value for " + toInsert.name);
                }
            } else {
                // For typical parts use the result_count or default to 1
                toInsert.outputCount = recipe.result_count || 1;
            }

            // Turn the vaired ingredient inputs into instances of Ingredient
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