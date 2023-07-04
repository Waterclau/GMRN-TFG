import { LoginService } from '../../../services/loginService';
import { NbMenuService, NbPopoverModule,NbProgressBarModule } from '@nebular/theme';
import { Component, ElementRef, ViewChild, NgModule, OnInit } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';



@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  loadingLargeGroup = false;
  loginFirst: boolean;
  showAlert: boolean;
  muestraGenerada: boolean;
  executing: boolean;
  progressValue: number;
  progressBarText: string;
  progressBarColor: string;
  lastSong: {nombre: string, titulo: string, id: number}
  isPlaying: boolean;
  audioUrl = '../../../../assets/music/generated/one.mp3';
  audioElement: HTMLAudioElement;
 // src\assets\music\generated\one.mp3

  toggleLoadingLargeGroupAnimation() {
    this.loadingLargeGroup = !this.loadingLargeGroup;
  }
  constructor(private menuService: NbMenuService, private loginService: LoginService, private router: Router, private http: HttpClient,) {}
  
  ngOnInit(): void {
    this.muestraGenerada = false;
    this.progressValue = 25;
    this.progressBarColor = 'primary';
    this.isPlaying = false;
  }


  goToLibrary() {
    if (this.loginService.loginUser == true) {
      this.router.navigate(['/pages/tables/tree-grid']); // Redireccionar a la URL deseada
      //window.location.href = '/pages/tables/tree-grid';
      console.log(this.loginService.loginData.nombre)
    } else {
      this.loginFirst = true;
      console.log(this.loginFirst);
    }
  }

  goToLogin(){
    this.router.navigate(['auth/login']); // Redireccionar a la URL deseada
    //window.location.href = 'auth/login';
  }

  ejecutarModelo(event: Event) {
    this.executing = true;
    this.actualizarProgreso();
    event.preventDefault(); // Evitar la recarga de la página
    const url = 'http://127.0.0.1:8000/ejecutar_script';
    this.http.get<any>(url)
      .subscribe(response => {
        console.log(response);
        const success = response[0].success;
        const songName = response[1]
        if (success) {
          this.muestraGenerada = true;
          console.log(songName);
          if(this.loginService.loginUser == true){
            this.lastSong = {
              nombre: this.loginService.loginData.nombre,
              titulo: 'model-p-3-2023-06-21.mid',//songName,
              id: 1,
            }
            this.añadirCanción();
          }
        } else {
          console.log('Error al ejecutar el modelo');
          this.muestraGenerada = false;
        }
      }, error => {
        console.error(error);
        this.muestraGenerada = false;
      });
  }

  añadirCanción(){
    this.http.post<any>('http://127.0.0.1:5000/insertar_cancion', this.lastSong)
    .subscribe(response => {
      const success = response[0].success;
      console.log(response);
      if (success) {
        console.log('Registro exitoso');
      } else {
        console.log('Registro fallido');
      }
    }, error => {
      console.error(error);
    });
  }
  
  

  actualizarProgreso() {
    const textos = ['Ejecutando programa', 'Ejecutando modelo', 'Generando muestra', 'Obteniendo muestra'];
    let indiceTexto = 0;
  
    this.progressBarText = textos[indiceTexto];
  
    setInterval(() => {
      this.progressBarColor = 'primary';
  
      if (this.progressValue < 100) {
        this.progressValue += 25;
  
        if (this.progressValue % 25 === 0) {
          indiceTexto = (indiceTexto + 1) % textos.length;
          this.progressBarText = textos[indiceTexto];
        }
      } else if (this.progressValue === 100) {
        this.progressBarText = 'Muestra obtenida correctamente';
        this.progressBarColor = 'success';
  
        setTimeout(() => {
          this.progressBarText = 'Muestra obtenida correctamente';
          this.progressBarColor = 'success';
  
          setTimeout(() => {
            this.executing = false;
          }, 2000);
        }, 5000);
      }
    }, 100000);
  }

  playAudio() {
    this.audioElement = new Audio(this.audioUrl);
    this.audioElement.play();
    this.isPlaying = true;
  }
  

  pauseAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }
  
  
  
  
  
  
  
}
