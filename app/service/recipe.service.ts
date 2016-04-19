
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
        
        let recipes: Recipe[] = [];

        res.json().forEach((recipe:any) => {
            let newRecipe: Recipe = new Recipe(
                recipe.type,
                recipe.name,
                recipe.energy_required || .5,
                [],
                recipe.category || 'n/a',
                recipe.enabled
            );

            // Some of the recipes (especially chemical ones) can have multiple results
            if(recipe.results) {
                // If there are multiple result objects we use the output count of the output matching
                // the recipe's name.
                let results:Result[] = recipe.results.filter((result: Result) => {
                    return result.name == recipe.name;
                });

                if(results.length == 1){
                    newRecipe.outputCount = results[0].amount;
                } else {
                    newRecipe.outputCount = 1;
                    console.debug("Couldn't find output count for " + newRecipe.name);
                }
            } else {
                // For typical parts use the result_count or default to 1
                newRecipe.outputCount = recipe.result_count || 1;
            }

            // Turn the vaired ingredient types into instances of Ingredient
            recipe.ingredients.forEach((ingredient:any) => {
                if(ingredient.type != null){
                    newRecipe.ingredients.push({
                        name: ingredient.name,
                        count: ingredient.amount
                    });
                }
                else {
                    newRecipe.ingredients.push({
                        name: ingredient[0],
                        count: ingredient[1]
                    });
                }
            });

            recipes.push(newRecipe);
        });

        return recipes || {};
    }

    private handleError(error: any) {
        let errMsg = error.message || 'Server Error';
        console.error(errMsg);

        return Observable.throw(errMsg);
    }
}