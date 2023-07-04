import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/loginService';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class NgxLoginComponent  {
  data: { nombre: string, pass: string };
  loginError: boolean = false;
  //loginUser: boolean = false;

  constructor(private http: HttpClient, private router: Router, private loginService : LoginService) {
    //super(null, null, null, null);
  }

  login() {
    const usernameInput = document.getElementById('input-username') as HTMLInputElement;
    const username = usernameInput.value;

    const passwordInput = document.getElementById('input-password') as HTMLInputElement;
    const password = passwordInput.value;

    this.data = {
      nombre: username,
      pass: password
    };

    console.log(this.data);

    this.http.post<any>('http://127.0.0.1:5000/login', this.data)
      .subscribe(response => {
        const success = response.success;
        if (success) {
          console.log('Inicio de sesión exitoso');
          this.router.navigate(['/pages/main/generator']); // Redireccionar a la URL deseada
          this.loginService.loginUser = true;
          console.log(this.loginService.loginUser)
          this.loginService.loginData = this.data;
          console.log(this.loginService.loginData);
        } else {
          console.log('Inicio de sesión fallido');
          this.loginError = true; // Establecer el indicador de error en true
        }
      }, error => {
        console.error(error);
      });
  }
}
