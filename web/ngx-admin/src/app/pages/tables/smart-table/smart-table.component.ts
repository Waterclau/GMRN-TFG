import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-star"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      cancion: {
        title: 'Cancion',
        type: 'string',
      },
      peso: {
        title: 'Peso',
        type: 'string',
      },
      duracion: {
        title: 'Duración',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor() {
    const data = [      { cancion: 'Cancion 1', peso: '3MB', duracion: '5:30' },      { cancion: 'Cancion 2', peso: '2MB', duracion: '3:45' },    ];
    this.source.load(data);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('¿Estás seguro de que quieres eliminar?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
