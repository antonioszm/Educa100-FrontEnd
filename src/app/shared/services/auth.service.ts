import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model.js';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) { }

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
      this.router.navigate(['/login']);
    }
  
    loginValido(): boolean {
      return !!localStorage.getItem('usuariologado');
    }

    verificarSeForAluno(){
      const usuarioLogado = localStorage.getItem('usuariologado');
      if (usuarioLogado) {
        const user = JSON.parse(usuarioLogado) as User;
        return user.papel === 'ALUNO';
      }
      return false;    
    }

    verificarSeForDocente(){
      const usuarioLogado = localStorage.getItem('usuariologado');
      if (usuarioLogado) {
        const user = JSON.parse(usuarioLogado) as User;
        return user.papel === 'DOCENTE';
      }
      return false;    
    }
    
    verificarSeForADM(){
      const usuarioLogado = localStorage.getItem('usuariologado');
      if (usuarioLogado) {
        const user = JSON.parse(usuarioLogado) as User;
        return user.papel === 'ADM';
      }
      return false;    
    }

    getUsuarioLogado(): User | null {
      const usuarioLogado = localStorage.getItem('usuariologado');
      return usuarioLogado ? JSON.parse(usuarioLogado) as User : null;
    }
}
