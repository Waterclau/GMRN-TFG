import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginUser: boolean;
  loginData:{ nombre: string, pass: string };
  //lastSongGenerated: { nombre: string, titulo: string, id: string }
  lastSongGenerated: { nombre: string, titulo: string, id: string }[] = [];

}

