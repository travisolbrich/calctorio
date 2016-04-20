import {Ingredient} from "./ingredient.model";
import {CraftingLevel} from "./crafting-level.model";

export class Recipe {
    type:string;
    name:string;
    energy:number;
    ingredients:Ingredient[];
    category:string;
    enabled:boolean;
    outputCount:number;

    // Create our basic object from a raw (datasource-provided) recipe
    // TODO: Here or controller?
    constructor(rawRecipe:any) {
        this.type = rawRecipe.type;
        this.name = rawRecipe.name;
        this.energy = rawRecipe.energy_required || .5;
        this.category = rawRecipe.category || 'n/a';
        this.enabled = rawRecipe.enabled;
        this.ingredients = [];
    }

    // Crafting time is based off of crafting levels or a chemistry modifier.
    getCraftingTime(craftingLevel:CraftingLevel):number {
        // Smelting is based on smelting level
        if (this.category == "smelting") {
            return this.energy / craftingLevel.smelter;
        }

        // Chemistry is a straight 1.25 modifier
        if (this.category == "chemistry") {
            return this.energy / 1.25;
        }

        // Otherwise we are going to use the assembler value
        return this.energy / craftingLevel.assembler;
    }

}