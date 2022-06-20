import {AfterViewChecked, Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-icon-notification',
  templateUrl: './icon-notification.component.html',
  styleUrls: ['./icon-notification.component.scss']
})
export class IconNotificationComponent implements AfterViewChecked {
  @ViewChild('iconNotification') iconElementRef: ElementRef | undefined;
  private _id: string | undefined;
  private _positionParent: DOMRect | undefined;
  private _placementIconNotification: string | undefined;

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewChecked(): void {
    this.calculatePositionIcon();
  }

  @Input() set id(pId: string | undefined) {
    this._id = pId;
  }

  get id(): string | undefined {
    return this._id;
  }

  @Input() set positionParent(pPositionParent: DOMRect) {
    this._positionParent = pPositionParent;
  };

  @Input() set placementIconNotification(pPlacementIconNotification: string | undefined) {
    this._placementIconNotification = pPlacementIconNotification;
  }

  onResize(pPositionParent: DOMRect) {
    this._positionParent = pPositionParent;
    this.calculatePositionIcon();
  }

  private calculatePositionIcon() {
    if (this._positionParent && this.iconElementRef) {
      let value: number = window.scrollY;
      switch (this._placementIconNotification) {
        case 'top': {
          value += this._positionParent.top - this.iconElementRef.nativeElement.offsetHeight;
          break;
        }
        case 'bottom': {
          value += this._positionParent.bottom + this.iconElementRef.nativeElement.offsetHeight;
          break;
        }
        case 'left': {
          this.renderer.setStyle(this.iconElementRef.nativeElement, 'left', `${this._positionParent.left - this.iconElementRef.nativeElement.offsetWidth - 5}px`);
          value += this._positionParent.top;
          break;
        }
        default: {
          this.renderer.setStyle(this.iconElementRef.nativeElement, 'left', `${this._positionParent.right + 5}px`);
          value += this._positionParent.top;
          break;
        }
      }
      this.renderer.setStyle(this.iconElementRef.nativeElement, 'top', `${value}px`);
    }
  }
}
