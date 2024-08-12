import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import type { Notas } from '../models/notas.model';
import type { Turma } from '../models/turma.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:3000/users'; 
  private notasUrl = 'http://localhost:3000/notas';
  private turmasUrl = 'http://localhost:3000/turmas';

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
    const url = `${this.usersUrl}/${usuario.id}`;
    return this.http.put(url, usuario, this.httpOptions);  
  }

  verificarDependencias(usuarioId: number, papel: string): Observable<boolean> {
    const turmas$: Observable<Turma[]> = this.http.get<Turma[]>(this.turmasUrl);
    const notas$: Observable<Notas[]> = this.http.get<Notas[]>(this.notasUrl);

    return forkJoin([turmas$, notas$]).pipe(
      map(([turmas, notas]) => {
        console.log('Papel:', papel);  // Verifique o valor de `papel`
        console.log('Usuario ID:', usuarioId);  // Verifique o valor de `usuarioId`

        console.log('Turmas:', turmas);
        console.log('notas:', notas);
        console.log(papel === 'DOCENTE')
        if (papel === 'DOCENTE') {
          console.log(papel === 'DOCENTE')
          const temTurmas = turmas.some(turma => turma.professor.id === usuarioId);
          const temAvaliacoes = notas.some(nota => nota.professor.id === usuarioId);
          console.log("a")
          console.log(temTurmas || temAvaliacoes)
          return temTurmas || temAvaliacoes;
        } else if (papel === 'ALUNO') {
          const temTurmas = turmas.some(turma => turma.professor.id === usuarioId && turma.professor.papel === 'ALUNO');
          const temAvaliacoes = notas.some(nota => nota.aluno.id === usuarioId);
          return temTurmas || temAvaliacoes;
        }
        return false;
      })
    );
  }
}