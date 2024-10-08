import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Turma } from '../models/turma.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private turmasUrl = 'http://localhost:3000/turmas'; 

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  listarTurmas(): Observable<any[]> {
    return this.http.get<any[]>(this.turmasUrl);
  }

  listarTurmaPorId(id: number): Observable<any> {
    const url = `${this.turmasUrl}/${id}`;
    return this.http.get<any>(url);
  }

  criarTurma(turma: any): Observable<any> {
    return this.http.post<any>(this.turmasUrl, turma, this.httpOptions);
  }

  removerTurma(id: number): Observable<any> {
    const url = `${this.turmasUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions);
  }

  listarTurmasPorDocenteId(docenteId: number): Observable<Turma[]> {
    const url = `${this.turmasUrl}?professor.id=${docenteId}`;
    return this.http.get<Turma[]>(url);
  }
  atualizarTurma(turma: any): Observable<any> {
    return this.http.put(this.turmasUrl, turma, this.httpOptions);
  }
}
