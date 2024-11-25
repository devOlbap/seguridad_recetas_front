import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginResponse } from 'src/app/model/loginresponse';
import { User } from 'src/app/model/usuario';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usuariosUrl = 'assets/JSON/usuarios.json';

  private token: string | null = null; 
  
  // private url : string = '';

  public userlog: User = {
    id:0,
    username:"",
    password:"",
    roles:[''],
  };

  constructor(private http: HttpClient,
    private router : Router
  ) {}

  login(username: string, password: string) {

    this.http.post(environment.url_api+'/api/auth/login', { username, password }).subscribe((response: any) => {
      localStorage.setItem('token', response.token);

      this.token = response.token

      this.router.navigate(['/home'])

      return response.token;
    });
  
  }

  getUsers(pk:number | undefined){

    if(!this.isAuthenticated()){
      this.router.navigate(['/home']);
      return null;
    }

    // console.log(this.getToken(),' token service')
    const headers = new HttpHeaders().set('Authorization', 'Bearer '+this.getToken());

    if(pk!=undefined){
      return this.http.get(environment.url_api+'/api/admin/user/id/'+pk,{headers});  
    }

    return this.http.get(environment.url_api+'/api/admin/users',{headers})
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token'); 
  }

  delToken(){
    this.token = null;
  }

  logout(){
    localStorage.removeItem('token');
    this.delToken();
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null; 
  }

  createUser(user:any): Observable<any> {

    return this.http.post(`${environment.url_api}/api/user/register`, user)
      .pipe(
        catchError(this.handleError<any>('createUser'))
      );
  }

  updateUser(user:any,username:string): Observable<any> {
    const head = this.getAuthHeaders();
    return this.http.put(`${environment.url_api}/api/admin/user/update/${username}`, user, {headers:head} )
      .pipe(
        catchError(this.handleError<any>('updateUser'))
      );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


}
