import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Recipe} from "../model/recipe.model";
import {Ingredient} from "../model/ingredient.model";
import {Result} from "../model/result.model";

@Injectable()
export class RecipeService {
    constructor(private http:Http) {
    }

    getRecipes(url:string):Observable<Recipe[]> {
        return this.http.get(url)
            .map(this.extractRecipes)
            .catch(this.handleError);
    }

    /*
        Extract an array of recipies from the JSON input.

        Because the JSON created by the Factorio data extractor is not standard across all recipes we must
        do some extra work to standardize into our `Recipe` model.
        - Some recipes have an array of results. For these, we look for a result with the same name as the recipe
          itself. We can then set the output count based on that. Other recipes give a result count directly.
        - Many of the chemistry and fluid related recipes have ingredients as objects instead of arrays. We must check
          to see how to import the data.
     */
    private extractRecipes(res:Response):Recipe[] {
        let recipes:Recipe[] = [];

        if (res.status < 200 || res.status >= 300) {
            throw new Error("Bad response status: " + res.status);
        }

        res.json().forEach((rawRecipe:any) => {
            let newRecipe:Recipe = new Recipe(rawRecipe);

            // Support recipes with multiple different results
            // TODO: Support refineries, etc. that have multiple results
            if (rawRecipe.results) {
                let results:Result[] = rawRecipe.results.filter((result:Result) => {
                    return result.name == rawRecipe.name;
                });

                if (results.length == 1) {
                    newRecipe.outputCount = results[0].amount;
                } else {
                    newRecipe.outputCount = 1;
                    console.debug("Couldn't find output count for " + newRecipe.name);
                }
            } else {
                newRecipe.outputCount = rawRecipe.result_count || 1;
            }

            // Support typed and untyped ingredients
            rawRecipe.ingredients.forEach((ingredient:any) => {
                if (ingredient.type) {
                    newRecipe.ingredients.push({
                        name: ingredient.name,
                        count: ingredient.amount
                    });
                } else {
                    newRecipe.ingredients.push({
                        name: ingredient[0],
                        count: ingredient[1]
                    });
                }
            });

            recipes.push(newRecipe);
        });

        return recipes;
    }

    private handleError(error:any) {
        let errMsg = error.message || 'Server Error';
        console.error(errMsg);

        return Observable.throw(errMsg);
    }
}