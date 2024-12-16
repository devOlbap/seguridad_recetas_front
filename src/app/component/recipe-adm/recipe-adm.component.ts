import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Receta } from 'src/app/model/receta';
import { RecipeService } from 'src/app/service/recipes/recipe.service';
import { UserService } from 'src/app/service/users/user.service';
import { User } from 'src/app/model/usuario';

@Component({
  selector: 'app-recipe-adm',
  templateUrl: './recipe-adm.component.html',
  styleUrls: ['./recipe-adm.component.css']
})
export class RecipeAdmComponent implements OnInit {
  recetas: Receta[] = [];
  actualiza = false;
  n_receta_form: FormGroup;
  receta_det_form: FormGroup;

  pk_receta:number|undefined;

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.checkAuthentication();

    // this.initializeForms(this.n_receta_form, this.receta_det_form);
    this.n_receta_form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      idUser: [{value:this.userService.id_usuario_log, disabled:true}, Validators.required],
      tipo_cocina: ['', Validators.required],
      pais_origen: ['', Validators.required],
      dificultad: ['', Validators.required],
      img_ruta: ['', Validators.required]
    });

    this.receta_det_form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      idUser: [{value:null, disabled:true}, Validators.required],
      tipo_cocina: ['', Validators.required],
      pais_origen: ['', Validators.required],
      dificultad: ['', Validators.required],
      img_ruta: ['', Validators.required]
    });
  }

  
  ngOnInit(): void {
    this.getRecetas();
  }

  getRecetas():boolean{
    this.recipeService.getRecetas(undefined)?.subscribe(
      (recipes: any) => {
        if(recipes.length>0){
          this.recetas = recipes
          return true;
        }
        return false;
      },
      (error) => {
        this.handleError(error, 'Error fetching recipes')
        return false;
      }
    );
    return true;
  }

  onSubmit() {

    this.handleFormSubmission(this.n_receta_form, (nuevaReceta:Receta) => {
      this.recipeService.postRecipe(nuevaReceta).subscribe(
        (response:Receta) => {
          if(response){
            if(this.recetas.push(response)){
              this.n_receta_form.reset();
              this.showAlert('Registrado correctamente');
              // return true;
            }
          }
        // return false;
        },
        (error)=>{
          this.showAlert(error.toString())
        }
      );
    });

  }
  deleteReceta(pk:number){
    if(!pk){
      return
    }
    this.recipeService.deleteRecipe(pk).subscribe((response:any)=>{
      if(response){
        this.getRecetas()
        this.showAlert('Eliminado correctamente!')
      }

    });

  }


  detalleReceta(id: number| undefined): void {
    if(!id){
      return ;
    }
    this.actualiza = true;
    this.pk_receta = id;
    this.recipeService.getRecetas(id).subscribe(
      (receta) => {
        if(receta){
          this.receta_det_form.patchValue(receta)
        }
      },
      (error) =>{
        this.handleError(error, `No se pudo obtener la receta con ID ${id}`)
      }
    );
  }


  actualizaReceta(): boolean {
    // if(this.receta_det_form.valid){
      this.handleFormSubmission(this.receta_det_form, (recetaActualizada) => {
        if (!this.pk_receta) return false;
        this.recipeService.updateReceta(recetaActualizada, this.pk_receta).subscribe((response:Receta) => {
          this.actualiza = false;
          this.getRecetas();
          return true;
        });
        return false;
      });
    // }
    
    return false;
  }


  limpiarFormN():boolean {
    this.n_receta_form.reset();
    return true
  }
  private handleFormSubmission(form: FormGroup, callback: (data: Receta) => void) {
    if (form.valid) {
      const receta: Receta = form.getRawValue();
      callback(receta);
    } else {
      console.error('Formulario inválido:', form.errors);
    }
  }
  private handleError(error: any, customMessage?: string): void {
    console.error(customMessage || 'Ocurrió un error', error);
    this.showAlert('Ha ocurrido un problema. Inténtalo nuevamente.');
  }
  showAlert(message: string): void {
    alert(message);
  }

  checkAuthentication(): boolean {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
  initializeForms(): boolean {
    // this.n_receta_form = this.fb.group({
    this.n_receta_form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      idUser: [{ value: null, disabled: true }, Validators.required],
      tipo_cocina: ['', Validators.required],
      pais_origen: ['', Validators.required],
      dificultad: ['', Validators.required],
      img_ruta: ['', Validators.required]
    });

    // this.receta_det_form = this.fb.group({
    this.receta_det_form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      idUser: [{ value: null, disabled: true }, Validators.required],
      tipo_cocina: ['', Validators.required],
      pais_origen: ['', Validators.required],
      dificultad: ['', Validators.required],
      img_ruta: ['', Validators.required]
    });
    return true;
  }
  // cancelarEdicion() {
  //   this.actualiza = false;
  //   this.receta_det_form.reset();
  // }
}
