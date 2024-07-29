import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`) 
      .pipe(
        map(users => {
          const user = users[0];
          if (user && user.senha === senha) {
            localStorage.setItem('usuariologado', JSON.stringify(users[0]));
            console.log("logado")
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
    }
    logout() {
      localStorage.removeItem('usuariologado');
    }
  
    loginValido(): boolean {
      return !!localStorage.getItem('usuariologado');
    }
}
