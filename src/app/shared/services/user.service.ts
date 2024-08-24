import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import type { Notas } from '../models/notas.model';
import type { Turma } from '../models/turma.model';
import { TurmaService } from './turma.service';
import { NotaService } from './nota.service';

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

  constructor(private http: HttpClient, private turmaService: TurmaService, private notasService: NotaService) { }

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
    return this.listarUsuarioPorId(usuarioId).pipe(
      switchMap(usuario => {
        let temDependencias = false;
        if (papel === 'DOCENTE') {
          return forkJoin([
            this.turmaService.listarTurmasPorDocenteId(usuarioId),
            this.notasService.listarNotasPorDocenteId(usuarioId)
          ]).pipe(
            map(([turmasDocente, notasDocente]) => {
              temDependencias = turmasDocente.length > 0 || notasDocente.length > 0;
              return temDependencias;
            })
          );
        } else if (papel === 'ALUNO') {
          return this.notasService.listarNotasPorAlunoId(usuarioId).pipe(
            map(notasUsuario => {
              temDependencias = usuario.turmas && usuario.turmas.length > 0 || notasUsuario.some(nota => nota.aluno.id === usuarioId);
              return temDependencias;
            })
          );
        }
        return of(temDependencias); 
      })
    );
  }
}