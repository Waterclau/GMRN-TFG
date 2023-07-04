import { Component, Input, OnInit } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { LoginService } from '../../../services/loginService'
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
//import {spawn} from 'child_process';



interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  author: string;
  id: string;
  items?: number;
  archive?: boolean;
}

@Component({
  selector: 'ngx-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss']
})
export class BibliotecaComponent implements OnInit {
  selectedRow: { nombre: string, author: string, id: string };
  loginError: boolean;
  user: string;
  listaElementos: { nombre: string, titulo: string, id: string }[] = [];
  requestData: { nombre: string };
  cancionGenerada: boolean; 
  downloadChart: boolean;
  descargaLoading: boolean;
  numberitems: string | null;
  downloadFormat: string = 'midi'; // Valor inicial seleccionado
  inputValue: string = '';
  private data: TreeNode<FSEntry>[] = [
    {
      data: { name: 'Canción', author: 'user', items: 9, id: 'nº generado' },
      children: [
       /* { data: { name: 'project-1.doc', id: 'doc', author: '240 KB', archive: false } },
        { data: { name: 'project-2.doc', id: 'doc', author: '290 KB', archive: false } },
        { data: { name: 'project-3', id: 'txt', author: '466 KB', archive: false } },
        { data: { name: 'project-4.docx', id: 'docx', author: '900 KB', archive: false } },*/
      ],
    },
  ];
  dataSource: NbTreeGridDataSource<FSEntry>;
  customColumn = 'name';
  defaultColumns = ['author', 'id', 'items', 'archive'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private router: Router,
  ) {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  ngOnInit(): void {
    if (this.loginService.loginData) {
      this.user = this.loginService.loginData.nombre;
      this.cancionGenerada = false; 
    }
    else{
      this.descargaLoading = false;
      this.cancionGenerada = true;
      this.listaElementos = this.loginService.lastSongGenerated;
      console.log(this.listaElementos[0])
      this.updateDataChildren();
      this.obtenerArchivoMIDI();
    }
    this.getLista();
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  private getLista() {
    this.loginError = false;
    if (this.user == undefined) {
      this.loginError = true;
      console.log("Usuario no registrado");
      console.log(this.loginError);
    } else {
      this.requestData = {
        nombre: this.user.toString()
      };
      this.listaElementos = [];

      console.log(this.requestData);

      this.http.post<any>('http://127.0.0.1:5000/canciones', this.requestData)
        .subscribe(response => {
          console.log(response[0]); // Verificar la respuesta completa en la consola

          const success = response[0].success; // Acceder a success dentro de la respuesta
          if (success) {
            console.log('Elementos obtenidos correctamente');
            this.listaElementos = response.slice(1);
            console.log(this.listaElementos[0]);
            this.numberitems = (this.listaElementos.length).toString()
            this.updateDataChildren();
          } else {
            console.log('Error al obtener elementos');
          }
        }, error => {
          console.error(error);
        });
    }
  }

  //Ruta archivo wav

  convertirMIDIaWAV(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const url = 'http://127.0.0.1:5000/convert_wav';
    const midiFilePath = 'src/assets/music/generated/one.mid';
  
    this.obtenerArchivoMIDI().then((file: File) => {
      const formData = new FormData();
      formData.append('file', file); // Cambiamos el nombre del campo a 'midi_file'
      this.descargaLoading = true;
  
      this.http.post(url, formData, { responseType: 'blob', observe: 'response' }).subscribe(
        (response: any) => {
          console.log(response); // Verificar la respuesta completa en la consola
  
          const success = response.status === 200; // Verificar el código de estado de la respuesta
          if (success) {
            console.log('Archivo WAV convertido correctamente');
            //this.downloadMidi(event);
            this.descargaLoading = false;
            const contentDispositionHeader = response.headers.get('content-disposition');
            const filename = contentDispositionHeader ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim() : this.inputValue + '.wav';
            const wavFile = new File([response.body], filename, { type: 'audio/wav' });
            //this.downloadWAVFile(wavFile); // Descargar el archivo WAV
            this.dw(event);
          } else {
            console.log('Error al convertir el archivo MIDI a WAV');
          }
        },
        error => {
          console.error(error);
        }
      );
    }).catch(error => {
      console.error(error);
    });
  }
  
  downloadWAVFile(file: File) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  //Ruta archivo MP3
  
  convertirMIDIaMP3(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const url = 'http://127.0.0.1:5000/convert_mp3';
    const midiFilePath = 'src/assets/music/generated/one.mid';
  
    this.obtenerArchivoMIDI().then((file: File) => {
      const formData = new FormData();
      formData.append('file', file); // Cambiamos el nombre del campo a 'midi_file'
      this.descargaLoading = true;
  
      this.http.post(url, formData, { responseType: 'blob', observe: 'response' }).subscribe(
        (response: any) => {
          console.log(response); // Verificar la respuesta completa en la consola
  
          const success = response.status === 200; // Verificar el código de estado de la respuesta
          if (success) {
            console.log('Archivo MP3 convertido correctamente');
            //this.downloadMidi(event);
            this.descargaLoading = false;
            const contentDispositionHeader = response.headers.get('content-disposition');
            const filename = contentDispositionHeader ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim() : this.inputValue + '.mp3';
            const mp3File = new File([response.body], filename, { type: 'audio/mp3' });
            //this.downloadMP3File(mp3File); // Descargar el archivo mp3
            this.dm(event);
          } else {
            console.log('Error al convertir el archivo MIDI a WAV');
          }
        },
        error => {
          console.error(error);
        }
      );
    }).catch(error => {
      console.error(error);
    });
  }

  //Ruta archivo FLAC
  
  convertirMIDIaFlac(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const url = 'http://127.0.0.1:5000/convert_flac';
    const midiFilePath = 'src/assets/music/generated/one.mid';
  
    this.obtenerArchivoMIDI().then((file: File) => {
      const formData = new FormData();
      formData.append('file', file); // Cambiamos el nombre del campo a 'midi_file'
      this.descargaLoading = true;
  
      this.http.post(url, formData, { responseType: 'blob', observe: 'response' }).subscribe(
        (response: any) => {
          console.log(response); // Verificar la respuesta completa en la consola
  
          const success = response.status === 200; // Verificar el código de estado de la respuesta
          if (success) {
            console.log('Archivo Flac convertido correctamente');
            //this.downloadMidi(event);
            this.descargaLoading = false;
            const contentDispositionHeader = response.headers.get('content-disposition');
            const filename = contentDispositionHeader ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim() : this.inputValue + '.flac';
            const flacFile = new File([response.body], filename, { type: 'audio/flac' });
            //this.downloadFlacFile(flacFile); // Descargar el archivo flac
            this.df(event);
          } else {
            console.log('Error al convertir el archivo MIDI a flac');
          }
        },
        error => {
          console.error(error);
        }
      );
    }).catch(error => {
      console.error(error);
    });
  }
  
  downloadMP3File(file: File) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  downloadFlacFile(file: File) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  dw(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const filePath = 'assets/music/generated/one.wav';
  
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        // Crear URL del blob
        const url = URL.createObjectURL(blob);
        // Crear elemento <a> para la descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = this.selectedRow.nombre;//'one.mid';
        // Simular clic en el enlace para iniciar la descarga
        link.click();
        // Liberar el objeto URL creado
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al descargar la canción:', error);
      });
  }

  dm(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const filePath = 'assets/music/generated/one.mp3';
  
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        // Crear URL del blob
        const url = URL.createObjectURL(blob);
        // Crear elemento <a> para la descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = this.selectedRow.nombre;//'one.mid';
        // Simular clic en el enlace para iniciar la descarga
        link.click();
        // Liberar el objeto URL creado
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al descargar la canción:', error);
      });
  }

  df(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const filePath = 'assets/music/generated/one.flac';
  
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        // Crear URL del blob
        const url = URL.createObjectURL(blob);
        // Crear elemento <a> para la descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = this.selectedRow.nombre;//'one.mid';
        // Simular clic en el enlace para iniciar la descarga
        link.click();
        // Liberar el objeto URL creado
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al descargar la canción:', error);
      });
  }
  


  obtenerArchivoMIDI(): Promise<File> {
    const url = 'assets/music/generated/one.mid'; // Ruta relativa al archivo .mid en tu proyecto
  
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        // Aquí puedes hacer algo con el archivo .mid, como enviarlo al servidor
        return new File([blob], 'file.mid', { type: 'audio/midi' });
      })
      .catch(error => {
        console.error('Error al obtener el archivo MIDI:', error);
        // Maneja el error adecuadamente
        throw error;
      });
  }
  downloadWavFile(wavFile: File) {
    // Crear URL del archivo
    const url = URL.createObjectURL(wavFile);
    // Crear elemento <a> para la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = wavFile.name;
    // Simular clic en el enlace para iniciar la descarga
    link.click();
    // Liberar el objeto URL creado
    URL.revokeObjectURL(url);
  }
  


  selectDownload(row: any) {
    if(row.level == 0){

    }
    else{
      this.downloadChart = true;
      this.selectedRow = {
        nombre: row.data.name || '',
        author: row.data.author || '',
        id: row.data.id || ''
      };
      this.inputValue = this.selectedRow.nombre;
      console.log(this.selectedRow); // Muestra la fila seleccionada en la consola
    }
  }

  //Version 1 , recarga la página una vez descargado
  /*
  downloadSong() {
    const filePath = 'assets/music/cancion1.mid';
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'cancion1.mid';
    link.click();
  }*/
  //Version 2, descarga sin recargar sin comprimir
  downloadSong(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const filePath = 'assets/music/generated/one.mid';
  
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        // Crear URL del blob
        const url = URL.createObjectURL(blob);
        // Crear elemento <a> para la descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = this.selectedRow.nombre;//'one.mid';
        // Simular clic en el enlace para iniciar la descarga
        link.click();
        // Liberar el objeto URL creado
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al descargar la canción:', error);
      });
  }

  downloadMidi(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const filePath = 'assets/music/generated/one.wav';
  
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        // Crear URL del blob
        const url = URL.createObjectURL(blob);
        // Crear elemento <a> para la descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = 'one.wav';
        // Simular clic en el enlace para iniciar la descarga
        link.click();
        // Liberar el objeto URL creado
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al descargar la canción:', error);
      });
  }

  downloadMP3(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
  
    const filePath = 'assets/music/generated/one.MP3';
  
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        // Crear URL del blob
        const url = URL.createObjectURL(blob);
        // Crear elemento <a> para la descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = 'one.MP3';
        // Simular clic en el enlace para iniciar la descarga
        link.click();
        // Liberar el objeto URL creado
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al descargar la canción:', error);
      });
  }

    // Función que se ejecuta cuando se cambia la selección
    asignarValor() {
      const selectedRadio = document.querySelector('nb-radio-group input:checked') as HTMLInputElement;
      if (selectedRadio) {
        this.downloadFormat = selectedRadio.value;
      }
    }
    
    
  
    getSelectedValue() {
      const selectedRadio = document.querySelector('nb-radio-group nb-radio:checked');
      return selectedRadio ? selectedRadio.getAttribute('value') : null;
    }
  
  downloading(event: Event){
    event.preventDefault(); // Evitar la recarga de la página
    console.log(this.downloadFormat)
    if(this.downloadFormat == 'midi'){
      this.downloadSong(event);
    }
    if(this.downloadFormat == 'wav'){
      this.convertirMIDIaWAV(event);
    }
    if(this.downloadFormat == 'mp3'){
      this.convertirMIDIaMP3(event);
    }
    if(this.downloadFormat == 'flac'){
      this.convertirMIDIaFlac(event);
    }
  }
  

  updateDataChildren() {
    if(this.user == undefined){
      const children: TreeNode<FSEntry>[] = this.addChildrenRecursively1(this.listaElementos[0]);
      this.data[0].children = children;
      this.dataSource.setData(this.data);
      this.data[0].data.id = this.numberitems;
    }
    else{
      const children: TreeNode<FSEntry>[] = this.addChildrenRecursively2(this.listaElementos[0]);
      this.data[0].children = children;
      this.dataSource.setData(this.data);
    }
  }

 //Solo añade elementos iterables
 addChildrenRecursively2(item: any): TreeNode<FSEntry>[] {
    const children: TreeNode<FSEntry>[] = [];
    for (const obj of item) {
      console.log(obj);
    
      const child: TreeNode<FSEntry> = {
        data: {
          name: obj.titulo || '',
          id: obj.id || '',
          author: obj.nombre || '',
          archive: false
        },
      };
      children.push(child);
      console.log(child);
    }
  
    return children;
  }

  //Puede añadir elementos no iterables
  addChildrenRecursively1(item: any): TreeNode<FSEntry>[] {
    const children: TreeNode<FSEntry>[] = [];
  
    const child: TreeNode<FSEntry> = {
      data: {
        name: item.titulo || '',
        id: item.id || '',
        author: item.nombre || '',
        archive: false
      },
    };
    children.push(child);
    console.log(child);
  
    return children;
  }

  private goToLogin(){
    this.router.navigate(['auth/login']); // Redireccionar a la URL deseada
    //window.location.href = 'auth/login';
  }

  toggleArchiveCheckbox(node: TreeNode<FSEntry>) {
    node.data.archive = !node.data.archive;
  }
  
  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
