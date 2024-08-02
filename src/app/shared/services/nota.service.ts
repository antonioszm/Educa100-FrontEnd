import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private notasUrl = 'http://localhost:3000/notas'; 

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  listarNotas(): Observable<any[]> {
    return this.http.get<any[]>(this.notasUrl);
  }

  listarNotaPorId(id: number): Observable<any> {
    const url = `${this.notasUrl}/${id}`;
    return this.http.get<any>(url);
  }

  criarNota(nota: any): Observable<any> {
    return this.http.post<any>(this.notasUrl, nota, this.httpOptions);
  }

  removerNota(id: number): Observable<any> {
    const url = `${this.notasUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions);
  }

  atualizarNota(nota: any): Observable<any> {
    return this.http.put(this.notasUrl, nota, this.httpOptions);
  }
}
