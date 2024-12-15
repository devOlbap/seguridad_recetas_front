import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receta } from 'src/app/model/receta';
import { RecipeService } from 'src/app/service/recipes/recipe.service';
import { UserService } from 'src/app/service/users/user.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  carrito: Receta[] = [];

  constructor(
    private recipeService: RecipeService,
    private userService:UserService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.carrito = this.recipeService.getCarrito();
  }

  deleteFromCart(pk:number){
    this.recipeService.removeFromCart(pk);
    this.ngOnInit();
  }

}
