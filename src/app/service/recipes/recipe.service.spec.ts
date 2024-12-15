import { TestBed } from '@angular/core/testing';
import { RecipeService } from './recipe.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '../users/user.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Component } from '@angular/core';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['getToken', 'getUserLogId']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RecipeService,
        { provide: UserService, useValue: userService }
      ]
    });

    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  
  it('should add a recipe to the cart',()=>{
    const m_recipe = { 
      id_recipe: 1,
      nombre: 'New Recipe', 
      descripcion: 'A new recipe', 
      idUser: 1, 
      tipo_cocina: 1, 
      pais_origen: 1, 
      dificultad: '2', 
      img_ruta: 'new_recipe.jpg',
      fecha_creacion: "2020",
      autor: 1 
    };
    expect(service.addCart(m_recipe)).toBeTruthy();
  });



  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRecetas without pk and return recipes', () => {
    const mockRecipes = [{ 
      id_recipe: 1,
      nombre: 'New Recipe', 
      descripcion: 'A new recipe', 
      idUser: 1, 
      tipo_cocina: 1, 
      pais_origen: 1, 
      dificultad: '2', 
      img_ruta: 'new_recipe.jpg',
      fecha_creacion: "2020",
      autor: 1 
    }, { 
      id_recipe: 2,
      nombre: 'New Recipe2', 
      descripcion: 'A new recipe2', 
      idUser: 2, 
      tipo_cocina: 2, 
      pais_origen: 2, 
      dificultad: '2', 
      img_ruta: 'new_recipe2.jpg',
      fecha_creacion: "2020",
      autor: 2 
    }];
    userService.getToken.and.returnValue('fake-token');

    service.getRecetas(undefined).subscribe(recipes => {
      expect(recipes).toEqual(mockRecipes);
    });

    const req = httpMock.expectOne(`${environment.url_api}/api/recipes`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(mockRecipes);
  });

  it('should call getRecetas with pk and return a single recipe', () => {
    const mockRecipe = { 
      id_recipe: 1,
      nombre: 'New Recipe', 
      descripcion: 'A new recipe', 
      idUser: 1, 
      tipo_cocina: 1, 
      pais_origen: 1, 
      dificultad: '2', 
      img_ruta: 'new_recipe.jpg',
      fecha_creacion: "2020",
      autor: 1 
    };
    const pk = 1;
    userService.getToken.and.returnValue('fake-token');

    service.getRecetas(pk).subscribe(recipe => {
      expect(recipe).toEqual(mockRecipe);
    });

    const req = httpMock.expectOne(`${environment.url_api}/api/recipes/${pk}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(mockRecipe);
  });

  it('should remove a recipe from the cart',()=>{
    service.addCart({ 
      id_recipe: 1,
      nombre: 'New Recipe', 
      descripcion: 'A new recipe', 
      idUser: 1, 
      tipo_cocina: 1, 
      pais_origen: 1, 
      dificultad: '2', 
      img_ruta: 'new_recipe.jpg',
      fecha_creacion: "2020",
      autor: 1 
    })
    expect(service.removeFromCart(1)).toBeFalsy();
  });

  it('should call postRecipe and create a recipe', () => {
    const newRecipe = { name: 'New Recipe' };
    const mockResponse = { id: 1, name: 'New Recipe' };
    userService.getToken.and.returnValue('fake-token');
    userService.getUserLogId.and.returnValue(1);

    service.postRecipe(newRecipe).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/api/recipes/user/1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(mockResponse);
  });

  it('should call deleteRecipe and delete a recipe', () => {
    const pk = 1;
    userService.getToken.and.returnValue('fake-token');

    service.deleteRecipe(pk).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.url_api}/api/recipes/${pk}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(null); 
  });

  it('should call updateReceta and update a recipe', () => {
    const updatedRecipe = { name: 'Updated Recipe' };
    const pk = 1;
    const mockResponse = { id: 1, name: 'Updated Recipe' };
    userService.getToken.and.returnValue('fake-token');

    service.updateReceta(updatedRecipe, pk).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.url_api}/api/recipes/${pk}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(mockResponse);
  });

  it('should handle error gracefully when postRecipe fails', () => {
    const newRecipe = { name: 'New Recipe' };
    userService.getToken.and.returnValue('fake-token');
    userService.getUserLogId.and.returnValue(1);

    service.postRecipe(newRecipe).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.url_api}/api/recipes/user/1`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
