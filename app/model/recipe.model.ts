import {Ingredient} from "./ingredient.model";

export class Recipe {
    type: string;
    name: string;
    time: number;
    ingredients: Ingredient[];
    category: string;
    enabled: boolean;
    outputCount: number;
    ips: number;
}