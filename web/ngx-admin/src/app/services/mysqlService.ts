import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as mysql from 'mysql';

@Injectable({
  providedIn: 'root',
})
export class MysqlService {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost', // O la dirección del servidor remoto
      user: 'root',
      password: 'C4rl1t0s',
      database: 'clientes',
    });
  }

  public query(sql: string, args?: any[]): Observable<any[]> {
    return new Observable((observer) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(rows);
        }
        observer.complete();
      });
    });
  }
}
