import {OnInit, Component} from "angular2/core";
import {RecipeService} from "../service/recipe.service";
import {Recipe} from "../model/recipe.model";
import {CraftingLevel} from "../model/crafting-level.model";

@Component({
    selector: 'recipe-list',
    templateUrl: 'app/component/recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {

    constructor (private _recipeService: RecipeService) {}
    
    recipes: Recipe[];
    craftingLevel: CraftingLevel;

    ngOnInit() {
        this.craftingLevel = {assembler: 1, smelter: 1};
        this.getRecipes();
    }

    onKey(value:string) {
        this.craftingLevel.assembler = +value;
    }

    getRecipes() {

        this._recipeService.getRecipes("app/data/core-0-12-29.json").subscribe(
            recipes => this.recipes = recipes
        );

    }
}