import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Notas } from '../models/notas.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:3000/users'; 
  private notasUrl = 'http://localhost:3000/notas';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.usersUrl);
  }

  listarUsuarioPorId(id: number): Observable<any> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<any>(url);
  }

  listarAlunos(): Observable<any[]> {
    const url = `${this.usersUrl}?papel=ALUNO`;
    return this.http.get<any[]>(url);
  }

  listarDocentes(): Observable<any[]> {
    const url = `${this.usersUrl}?papel=DOCENTE`;
    return this.http.get<any[]>(url);
  }

  listarAvaliacoesDoAluno(alunoId: number): Observable<Notas[]> {
    const url = `${this.notasUrl}?aluno.id=${alunoId}`;
    return this.http.get<Notas[]>(url);
  }

  criarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, usuario, this.httpOptions);
  }

  removerUsuario(id: number): Observable<any> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions);
  }

  atualizarUsuario(usuario: any): Observable<any> {
    return this.http.put(this.usersUrl, usuario, this.httpOptions);
  }
}