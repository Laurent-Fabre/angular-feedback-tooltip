import {Directive, ElementRef} from '@angular/core';
import {fromEvent} from "rxjs";

@Directive({
  selector: 'form'
})
export class FormSubmitDirective {

  submit$ = fromEvent(this.element, 'submit');

  constructor(private host: ElementRef<HTMLFormElement>) {
  }

  get element() {
    return this.host.nativeElement;
  }
}
