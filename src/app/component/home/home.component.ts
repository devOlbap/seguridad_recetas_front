import { Component, OnInit } from '@angular/core';
import { Receta } from 'src/app/model/receta';
import { RecipeService } from 'src/app/service/recipes/recipe.service';
import { UserService } from 'src/app/service/users/user.service';


declare var bootstrap: any;  // Declarar Bootstrap para poder usar los modales

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  recetas: Receta[] = [];
  detalleModal: any; 


  constructor(
    private recipeService: RecipeService,
  ) {}

  ngOnInit(): void {

    // if(this.usrService.isAuthenticated()){
    //   this.getRecetas();
    // }

    // console.log(this.usrService.getToken())

      this.getRecetas();


  }

  getRecetas(){
    this.recipeService.getRecetas(undefined)?.subscribe((recipes:any)=>{
      if(recipes.length > 0 ){
        this.recetas= recipes;
        return
      }
    });
  }
  getRecetaById(pk:number){

  }

  addToCart(receta:any){
    this.recipeService.addCart(receta);
  }

  recetaInCart(pk:number):Boolean{

    return this.recipeService.idRecipeInCart(pk);
    // if(this.recipeService.idRecipeInCart(pk)){
    //   return true;
    // }
    // return false;
  }



  recetaSeleccionada: any;

  verDetalle(id: number) {
   
    this.recipeService.getRecetas(id).subscribe((receta:any)=>{
      this.recetaSeleccionada = receta;
    })

    this.detalleModal = new bootstrap.Modal(document.getElementById('detalleModal'), {});
    this.detalleModal.show();
  }

  cerrarModal() {
    // Verificamos si el modal existe antes de intentar cerrarlo
    if (this.detalleModal) {
      this.detalleModal.hide();
    }
  }

}
