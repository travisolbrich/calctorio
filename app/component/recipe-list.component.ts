import {OnInit, Component} from "angular2/core";
import {RecipeService} from "../service/recipe.service";
import {Recipe} from "../model/recipe.model";

@Component({
    selector: 'recipe-list',
    templateUrl: 'app/component/recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {

    constructor (private _recipeService: RecipeService) {}
    
    recipes: Recipe[];
    
    ngOnInit() { this.getRecipes() }
    
    getRecipes() {

        this._recipeService.getRecipes("app/data/core-0-12-29.json").subscribe(
            recipes => this.recipes = recipes
        );

    }
}