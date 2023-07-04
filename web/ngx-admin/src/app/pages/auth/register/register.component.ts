import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/loginService';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent{
  data: { nombre: string, pass: string };
  repassError: boolean;
  registerError: boolean;


  constructor(private http: HttpClient, private router: Router, private loginService : LoginService) { 

  }
  register() {
    const usernameInput = document.getElementById('input-username') as HTMLInputElement;
    const username = usernameInput.value;

    const passwordInput = document.getElementById('input-password') as HTMLInputElement;
    const password = passwordInput.value;

    const repasswordInput = document.getElementById('input-re-password') as HTMLInputElement;
    const repassword = repasswordInput.value;
    this.data = {
      nombre: username,
      pass: password
    };
    this.repassError = false;
    this.registerError = false;

    console.log(this.data);
    console.log(repassword)

    if(repassword == undefined || repassword != password || repassword == ''){
      this.repassError = true;
      console.log(this.repassError);
    }
    else{
      this.http.post<any>('http://127.0.0.1:5000/register', this.data)
      .subscribe(response => {
        const success = response.success;
        console.log(response);
        if (success) {
          console.log('Registro exitoso');
          this.loginService.loginData = this.data;
          this.router.navigate(['/pages/main/generator']); // Redireccionar a la URL deseada
        } else {
          console.log('Registro fallido');
          this.registerError = true;
        }
      }, error => {
        console.error(error);
      });
    }

  }

  goToLogin(){
    this.router.navigate(['auth/login']); // Redireccionar a la URL deseada
  }

  


}
