import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Receta } from 'src/app/model/receta';
import { UserService } from '../users/user.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private jsonUrl = 'assets/JSON/recetas.json'; 

  private carrito : Receta[]=[];

  constructor(
    private http: HttpClient,
    private userService : UserService,
  ) {}
  /**
   * Obtiene una o todas las recetas.
   * @param pk ID opcional de la receta a obtener.
   * @returns Observable de la receta o lista de recetas.
   */
  getRecetas(pk?: number): Observable<Receta[] | Receta> {
    const headers = this.getAuthHeaders();

    const url = pk
      ? `${environment.url_api}/api/recipes/${pk}`
      : `${environment.url_api}/api/recipes`;

    return this.http.get<Receta[] | Receta>(url, { headers }).pipe(
      catchError(this.handleError<Receta[] | Receta>('getRecetas'))
    );
  }

  /**
   * Crea una nueva receta.
   * @param recipe Datos de la receta a crear.
   * @returns Observable con la respuesta del servidor.
   */
  postRecipe(recipe: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${environment.url_api}/api/recipes/user/${this.userService.getUserLogId()}`;

    return this.http.post(url, recipe, { headers }).pipe(
      catchError(this.handleError<any>('postRecipe'))
    );
  }

  /**
   * Elimina una receta por su ID.
   * @param pk ID de la receta a eliminar.
   * @returns Observable con la respuesta del servidor.
   */
  deleteRecipe(pk: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${environment.url_api}/api/recipes/${pk}`;

    return this.http.delete(url, { headers }).pipe(
      catchError(this.handleError<any>('deleteRecipe'))
    );
  }

  /**
   * Actualiza una receta.
   * @param receta Datos actualizados de la receta.
   * @param pk ID de la receta a actualizar.
   * @returns Observable con la respuesta del servidor.
   */
  updateReceta(receta: any, pk: number): Observable<any> {
    const headers = this.getAuthHeaders();

    const url = `${environment.url_api}/api/recipes/${pk}`;

    return this.http.put(url, receta, { headers }).pipe(
      catchError(this.handleError<any>('updateRecipe'))
    );
  }

  /**
   * Agrega una receta al carrito.
   * @param receta Objeto de receta a agregar.
   */
  addCart(receta: Receta): boolean {

    if(this.idRecipeInCart(receta.id_recipe)){
      return false;
    }

    this.carrito.push(receta);
    return true;
    // if (!this.idRecipeInCart(receta.id_recipe)) {
    //   this.carrito.push(receta);
    //   alert('Receta agregada correctamente');
    // } else {
    //   alert('La receta ya está en el carrito');
    // }
  }

  /**
   * Obtiene el carrito actual.
   * @returns Lista de recetas en el carrito.
   */
  getCarrito(): Receta[] {
    return this.carrito;
  }

  /**
   * Elimina una receta del carrito por su ID.
   * @param recipeId ID de la receta a eliminar.
   */
  removeFromCart(recipeId: number): boolean {

    if(!this.idRecipeInCart(recipeId)){
      return false;
    }

    this.carrito = this.carrito.filter(
      (recipe) => {
        recipe.id_recipe !== recipeId
        return true;
      }
    );
    alert('Receta eliminada del carrito');

    return true;
  }


  /**
   * Verifica si una receta está en el carrito.
   * @param recipeId ID de la receta a verificar.
   * @returns true si está en el carrito, false en caso contrario.
   */
  idRecipeInCart(recipeId: number): boolean {
    return this.carrito.some((recipe) => recipe.id_recipe === recipeId);
  }

  /**
   * Genera las cabeceras de autorización.
   * @returns HttpHeaders con el token de autorización.
   */
  private getAuthHeaders(): HttpHeaders | undefined {
    const token = this.userService.getToken();
    if(!token){
      return ;
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Maneja errores de las peticiones HTTP.
   * @param operation Nombre de la operación.
   * @param result Resultado opcional para devolver.
   * @returns Observable con el resultado o un error.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
