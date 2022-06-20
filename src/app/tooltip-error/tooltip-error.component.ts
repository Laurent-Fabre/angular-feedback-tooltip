import {AfterViewChecked, Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-control-error',
  templateUrl: './tooltip-error.component.html',
  styleUrls: ['./tooltip-error.component.scss']
})
export class TooltipErrorComponent implements AfterViewChecked {
  @ViewChild('tooltip') tooltip: ElementRef | undefined;
  lstErrorToDisplay: string[] | undefined;
  private _diplay: boolean = false;
  private _positionParent: DOMRect | undefined;
  private _placementTooltip: string | undefined;


  constructor(private renderer: Renderer2) {
  }

  ngAfterViewChecked(): void {
    if (this._diplay) {
      this.calculatePositionTooltip();
    }
  }

  @Input() set lstErrorMessage(pLstErrorMessage: string[] | undefined) {
    this.lstErrorToDisplay = pLstErrorMessage;
  };

  @Input() set positionParent(pPositionParent: DOMRect) {
    this._positionParent = pPositionParent;
  };

  @Input() set placementTooltip(pPlacementTooltip: string | undefined) {
    this._placementTooltip = pPlacementTooltip;
  }

  @Input()
  set display(pDisplay: boolean) {
    this._diplay = pDisplay;
  }

  get display(): boolean {
    return this._diplay;
  }

  onResize(pPositionParent: DOMRect) {
    this._positionParent = pPositionParent;
    this.calculatePositionTooltip();
  }

  private cleanCSS() {
    if (this.tooltip) {
      this.renderer.removeStyle(this.tooltip.nativeElement, 'top');
      this.renderer.removeStyle(this.tooltip.nativeElement, 'left');
      this.renderer.removeClass(this.tooltip.nativeElement, 'top');
      this.renderer.removeClass(this.tooltip.nativeElement, 'bottom');
      this.renderer.removeClass(this.tooltip.nativeElement, 'right');
      this.renderer.removeClass(this.tooltip.nativeElement, 'left');
    }
  }

  private calculatePositionTooltip() {
    if (this._positionParent && this.tooltip) {
      this.cleanCSS();
      switch (this._placementTooltip) {
        case 'top': {
          if (!this.setPositionTop()) {
            this.automaticPlacement();
          }
          break;
        }
        case 'bottom': {
          if (!this.setPositionBottom()) {
            this.automaticPlacement();
          }
          break;
        }
        case 'left': {
          if (!this.setPositionLeft()) {
            this.automaticPlacement();
          }
          break;
        }
        default: {
          this.automaticPlacement();
          return;
        }
      }
    }
  }

  private setPositionLeft(): boolean {
    if (this._positionParent && this.tooltip && window.innerWidth - this._positionParent.left > (this.tooltip.nativeElement.offsetWidth + 10)) {
      this.renderer.setStyle(this.tooltip.nativeElement, 'left', `${this._positionParent.right + 10}px`);
      this.renderer.setStyle(this.tooltip.nativeElement, 'top', `${this._positionParent.top}px`);
      this.renderer.addClass(this.tooltip.nativeElement, 'left');
      return true;
    }
    return false;
  }

  private setPositionTop(): boolean {
    if (this._positionParent && this.tooltip && (this._positionParent.top - (this.tooltip.nativeElement.offsetHeight + 10) > 0)) {
      this.renderer.setStyle(this.tooltip.nativeElement, 'top', `${window.scrollY + this._positionParent.top - this.tooltip.nativeElement.offsetHeight - 10}px`);
      this.renderer.addClass(this.tooltip.nativeElement, 'top');
      return true;
    }
    return false;
  }

  private setPositionBottom(): boolean {
    if (this._positionParent && this.tooltip && window.innerHeight - this._positionParent.bottom > (this.tooltip.nativeElement.offsetHeight + 10)) {
      this.renderer.setStyle(this.tooltip.nativeElement, 'top', `${window.scrollY + this._positionParent.bottom + 10}px`);
      this.renderer.addClass(this.tooltip.nativeElement, 'bottom');
      return true;
    }
    return false;
  }

  private automaticPlacement() {
    if (this._positionParent && this.tooltip) {
      // Position de la scroll bar vertical.
      let value: number = window.scrollY;
      //window.innerWidth taille de l'écran en largeur
      if (window.innerWidth - this._positionParent.right > (this.tooltip.nativeElement.offsetWidth + 10)) {
        this.renderer.setStyle(this.tooltip.nativeElement, 'left', `${this._positionParent.right + 10}px`);
        value += this._positionParent.top;
        this.renderer.addClass(this.tooltip.nativeElement, 'right');
      } else if (window.innerHeight - this._positionParent.bottom > (this.tooltip.nativeElement.offsetHeight + 10)) {
        value += this._positionParent.bottom + 10;
        this.renderer.addClass(this.tooltip.nativeElement, 'bottom');
      } else if (this._positionParent.top - (this.tooltip.nativeElement.offsetHeight + 10) > 0) {
        value += this._positionParent.top - this.tooltip.nativeElement.offsetHeight - 10;
        this.renderer.addClass(this.tooltip.nativeElement, 'top');
      } else {
        this.renderer.setStyle(this.tooltip.nativeElement, 'left', `${this._positionParent.left - this.tooltip.nativeElement.offsetWidth - 10}px`);
        value += this._positionParent.top;
        this.renderer.addClass(this.tooltip.nativeElement, 'left');
      }
      this.renderer.setStyle(this.tooltip.nativeElement, 'top', `${value}px`);
    }
  }
}
