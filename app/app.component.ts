import {Component} from 'angular2/core';
import {HTTP_PROVIDERS} from "angular2/http";
import {RecipeService} from "./service/recipe.service";
import {RecipeListComponent} from "./component/recipe-list.component";

@Component({
    selector: 'calctorio',
    template: `<h1>Calctorio</h1>
              <recipe-list></recipe-list>
              `,

    directives: [
        RecipeListComponent
    ],
    
    providers: [
        HTTP_PROVIDERS,
        RecipeService
    ]
})
export class AppComponent { }