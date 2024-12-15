import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Receta } from 'src/app/model/receta';
import { RecipeService } from 'src/app/service/recipes/recipe.service';
import { UserService } from 'src/app/service/users/user.service';
import { User } from 'src/app/model/usuario';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  actualiza = false; 
  n_user: FormGroup;

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Validación de autenticación
    // if (!this.userService.isAuthenticated()) {
    //   this.router.navigate(['/home']);
    // }

    this.n_user = this.fb.group({
      username: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      password: ['', Validators.required],
      // roles: ['', Validators.required],
      // estado: ['', Validators.required],
    });

   
  }

  ngOnInit(): void {
    // this.recipeService.getRecetas(undefined)?.subscribe((recipes: any) => {
    //   this.recetas = recipes;
    // });
  }

  onSubmit() {
    if (this.n_user.valid) {
      const n_user: User = this.n_user.value;


      n_user.roles = ["ADMIN"];
      n_user.estado = true;

      // console.log(n_user)
      this.userService.createUser(n_user)?.subscribe((response:any)=>{
        // console.log(response)
        alert('Usuario '+response.nombre+' '+response.apellido+' creado correctamente!.');
        this.n_user.reset(); // Limpiar el formulario
        this.router.navigate(['/login']);
      })
      // this.recipeService.createReceta(nuevaReceta).subscribe((response) => {
      //   this.recetas.push(response);
      
      // });
    }
      
    // {
    //   "id_user": 2,
    //   "username": "sus",
    //   "nombre": "amogus",
    //   "apellido": "remoto",
    //   "password": "aksjd",
    //   "roles": [
    //       "USER"
    //   ],
    //   "estado": true,
    //   "comments": null
    // }
  }

  detalleReceta(id: number) {
    this.actualiza = true;
    this.recipeService.getRecetas(id).subscribe((receta) => {
      console.log(receta);
      // this.receta_det_form.patchValue(receta);
    });
  }

  actualizaReceta() {
    // if (this.receta_det_form.valid) {
    //   const recetaActualizada: Receta = this.receta_det_form.value;
    //   // this.recipeService.updateReceta(recetaActualizada).subscribe(() => {
    //   //   this.actualiza = false;
    //   //   this.ngOnInit();
    //   // });
    // }
  }

  limpiarFormN() {
    this.n_user.reset();
  }

  cancelarEdicion() {
    this.actualiza = false;
    // this.receta_det_form.reset();
  }
}
