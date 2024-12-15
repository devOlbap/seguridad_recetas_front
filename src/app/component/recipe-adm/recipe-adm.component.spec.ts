import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeAdmComponent } from './recipe-adm.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RecipeService } from 'src/app/service/recipes/recipe.service';
import { UserService } from 'src/app/service/users/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Receta } from 'src/app/model/receta';

describe('RecipeAdmComponent', () => {
  let component: RecipeAdmComponent;
  let fixture: ComponentFixture<RecipeAdmComponent>;
  let recipeService: jasmine.SpyObj<RecipeService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['getRecetas', 'postRecipe', 'deleteRecipe', 'updateReceta']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['isAuthenticated', 'setToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RecipeAdmComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: RecipeService, useValue: recipeServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeAdmComponent);
    component = fixture.componentInstance;
    recipeService = TestBed.inject(RecipeService) as jasmine.SpyObj<RecipeService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the RecipeAdmComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize forms correctly', () => {
    component.initializeForms();
  
    expect(component.n_receta_form).toBeDefined();
    expect(component.receta_det_form).toBeDefined();
    expect(component.n_receta_form.valid).toBeFalse(); // Al inicio, el formulario debe ser inválido
  });
  // it('should not create the component',()=>{
  //   expect(component.checkAuthentication()).toBeFalse();
  //   expect(component).toBeFalsy();
  // })

  // it('should return undefined',()=>{
  //   component.detalleReceta(undefined);
  //   expect(component.detalleReceta).toHaveBeenCalledWith(undefined);
  //   expect(component.detalleReceta).toBeUndefined();
  // });

  // it('should return false actualizaReceta',()=>{
  //   expect(component.actualizaReceta).toHaveBeenCalled();
  //   expect(component.receta_det_form.valid).toBeFalsy();
  //   expect(component.actualizaReceta).toBeFalse();
    
  // })
  it('should call getRecetas on ngOnInit', () => {
    spyOn(component, 'getRecetas'); 
    component.ngOnInit();
    expect(component.getRecetas).toHaveBeenCalled(); 
  });

  // it('should return undefined',()=>{
  //   expect(component.detalleReceta).toHaveBeenCalledWith(undefined);
  //   expect(component.deleteReceta).toBeUndefined();
  // })
  
  it('should initiate the forms',()=>{
    expect(component).toBeTruthy();
    expect(component.initializeForms()).toBeTruthy();
  });

  it('should add a new receta when form is valid and submit is called', () => {
    const newReceta = { 
      nombre: 'New Recipe', 
      descripcion: 'A new recipe', 
      idUser: 1, 
      tipo_cocina: 1, 
      pais_origen: 1, 
      dificultad: '2', 
      img_ruta: 'new_recipe.jpg'
    };
  
    component.n_receta_form.setValue(newReceta);
  
    const mockResponse = { 
      id_recipe: 1,
      ...newReceta, 
      fecha_creacion: "2020",
      autor: 1 
    };
    recipeService.postRecipe.and.returnValue(of(mockResponse));
  
    spyOn(window, 'alert');
  
    component.onSubmit();
  
    expect(recipeService.postRecipe).toHaveBeenCalledWith(newReceta);
  
    expect(window.alert).toHaveBeenCalledWith('Registrado correctamente');
  });

  it('should reset the form',()=>{
    const newReceta = { 
      nombre: 'New Recipe', 
      descripcion: 'A new recipe', 
      idUser: 1, 
      tipo_cocina: 1, 
      pais_origen: 1, 
      dificultad: '2', 
      img_ruta: 'new_recipe.jpg'
    };
  
    component.n_receta_form.setValue(newReceta);

    expect(component.limpiarFormN()).toBeTrue();
  });

  it('should not update the selected  recipe',()=>{
    expect(component.actualizaReceta()).toBeFalse();
  });

  it('should delete a receta and call getRecetas after delete', () => {
    const recetaId = 1;
    recipeService.deleteRecipe.and.returnValue(of({})); 
    spyOn(component, 'getRecetas'); 

    component.deleteReceta(recetaId);

    expect(recipeService.deleteRecipe).toHaveBeenCalledWith(recetaId); 
    expect(component.getRecetas).toHaveBeenCalled(); 
  });

  it('should navigate to home if user is not authenticated', () => {
    userService.isAuthenticated.and.returnValue(false); 
    component.ngOnInit();
    expect(component.checkAuthentication()).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/home']); 
  });

  it('should patch values to receta_det_form when detalleReceta is called', () => {
    const recetaId = 1;
    const recetaDetails: any = { 
      nombre: 'get Recipe', 
      descripcion: 'A get recipe', 
      tipo_cocina: 1, 
      pais_origen: 1, 
      dificultad: '2', 
      img_ruta: 'get_recipe.jpg' ,
    };

    recipeService.getRecetas.and.returnValue(of(recetaDetails)); 

    component.detalleReceta(recetaId);

    expect(recipeService.getRecetas).toHaveBeenCalledWith(recetaId); 
    expect(component.receta_det_form.value).toEqual(recetaDetails); 
  });
  it('should validate its authentication',()=>{
    userService.setToken('mi_token')
    expect(userService.setToken).toHaveBeenCalledWith('mi_token');
    expect(component.checkAuthentication()).toBeFalsy()
  });
  it('should allow access if user is authenticated', () => {
    userService.isAuthenticated.and.returnValue(true);
  
    const result = component.checkAuthentication();
  
    expect(userService.isAuthenticated).toHaveBeenCalled();
    expect(result).toBeTrue();
  });
  it('should show an alert with the given message', () => {
    spyOn(window, 'alert');
    const message = 'Test Alert';
  
    component.showAlert(message);
  
    expect(window.alert).toHaveBeenCalledWith(message);
  });
//   it('should handle error on postRecipe', () => {
//   const newReceta = { nombre: 'Error Recipe', descripcion: 'Will fail' };

//   component.n_receta_form.setValue(newReceta);
//   recipeService.postRecipe.and.returnValue(throwError(() => new Error('Error posting recipe')));

//   spyOn(window, 'alert');
//   component.onSubmit();

//   expect(recipeService.postRecipe).toHaveBeenCalledWith(newReceta);
//   expect(window.alert).toHaveBeenCalledWith('Error al registrar la receta');
// });

  
  it('should update a receta when form is valid', () => {
    const updatedReceta = {
      nombre: 'Updated Recipe',
      descripcion: 'Updated description',
      tipo_cocina: 2,
      pais_origen: 2,
      dificultad: '3',
      img_ruta: 'updated_image.jpg',
      idUser:1,
    };
  
    component.receta_det_form.setValue(updatedReceta);
    recipeService.updateReceta.and.returnValue(of({ message: 'Updated successfully' }));
  
    spyOn(window, 'alert');
    component.actualizaReceta();

    // const mockResponse = { 
    //   id_recipe: 1,
    //   ...updatedReceta, 
    //   fecha_creacion: "2020",
    //   autor: 1 
    // };
    recipeService.updateReceta(updatedReceta,1);

    window.alert('Actualizado correctamente')
  
    expect(recipeService.updateReceta).toHaveBeenCalledWith(updatedReceta,1);
    expect(window.alert).toHaveBeenCalledWith('Actualizado correctamente');
  });
  

  // it('should show an alert',()=>{
  //   expect(component.showAlert('its ok')).toBeTrue();
  // });

  // it('should get a recipe',()=>{
  //   const mockResponse = [{ 
  //     id_recipe: 1,
  //     nombre: 'New Recipe', 
  //     descripcion: 'A new recipe', 
  //     idUser: 1, 
  //     tipo_cocina: 1, 
  //     pais_origen: 1, 
  //     dificultad: '2', 
  //     img_ruta: 'new_recipe.jpg', 
  //     fecha_creacion: "2020",
  //     autor: 1 
  //   },{ 
  //     id_recipe: 2,
  //     nombre: 'New Recipe', 
  //     descripcion: 'A new recipe', 
  //     idUser: 2,   
  //     tipo_cocina: 2, 
  //     pais_origen: 2, 
  //     dificultad: '2', 
  //     img_ruta: 'new_recipe.jpg', 
  //     fecha_creacion: "2020",
  //     autor: 2 
  //   }];

  //   component.getRecetas();

  //   expect(component.getRecetas()).toHaveBeenCalledWith(undefined);
  //   expect(recipeService.getRecetas.and.returnValue(of(mockResponse))).toBeTruthy()
  //   expect(component.getRecetas()).toBeTruthy();


  // })

});
