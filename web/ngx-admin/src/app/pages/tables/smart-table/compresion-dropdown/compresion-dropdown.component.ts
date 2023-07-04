import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-compresion-dropdown',
  templateUrl: './compresion-dropdown.component.html',
  styleUrls: ['./compresion-dropdown.component.scss']
})
export class CompresionDropdownComponent {
  @Input() options: { value: string, title: string }[];
  @Input() selectedOption: string;
  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>();

  selectOption(value: string): void {
    this.selectedOption = value;
    this.optionSelected.emit(value);
  }
}
