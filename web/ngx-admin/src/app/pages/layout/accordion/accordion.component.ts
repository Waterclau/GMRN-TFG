import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss'],
})
export class AccordionComponent {
  radioGroupValue = 'This is value 2';
  song_list = 3;

  @ViewChild('item', { static: true }) accordion;

  fruits: string[] = [
    'Lemons',
    'Raspberries',
    'Strawberries',
    'Blackberries',
    'Kiwis',
    'Grapefruit',
    'Avocado',
    'Watermelon',
    'Cantaloupe',
    'Oranges',
    'Peaches',
  ];

  descargas: string[] = [
  ]

  //selected: {[nombre: string]: number} = {};

  toggle() {
    this.accordion.toggle();
  }

  selected = {};

  toggleSelection(fruit) {
    if (this.selected[fruit]) {
      delete this.selected[fruit];
    } else {
      this.selected[fruit] = true;
    }
    console.log(this.selected)
  }

  appendDescargas(){


  }
}
