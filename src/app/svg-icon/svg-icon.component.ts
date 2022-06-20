import {Component, Input} from '@angular/core';

@Component({
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent {

  @Input() icon!: string;

  constructor() {
  }

  get path(): string {
    return `assets/img/symbol-defs.svg#${this.icon}`;
  }
}
