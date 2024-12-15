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
    const userServiceSpy = jasmine.createSpyObj('UserService', ['isAuthenticated']);
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

  it('should call getRecetas on ngOnInit', () => {
    spyOn(component, 'getRecetas'); 
    component.ngOnInit();
    expect(component.getRecetas).toHaveBeenCalled(); 
  });

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

    expect(component.limpiarFormN()).toBeTruthy();
  });

  it('should update the selected  recipe',()=>{
    expect(component.actualizaReceta()).toBeTruthy();
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


});
