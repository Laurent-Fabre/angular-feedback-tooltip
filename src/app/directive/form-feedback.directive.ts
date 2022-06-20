import {
  ComponentRef,
  Directive,
  ElementRef,
  Host,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewContainerRef
} from '@angular/core';
import {AbstractControl, NgControl, ValidationErrors} from "@angular/forms";
import {TooltipErrorComponent} from "../tooltip-error/tooltip-error.component";
import {debounceTime, EMPTY, merge, Observable, Subject, takeUntil, tap} from "rxjs";
import {FormSubmitDirective} from "./form-submit.directive";
import {ControlErrorContainerDirective} from "./control-error-container.directive";
import {IconNotificationComponent} from "../icon-notification/icon-notification.component";
import {ERROR_MESSAGES} from "../model/error-messages";

@Directive({
  selector: '[formControl], [formControlName]'
})
export class FormFeedbackDirective implements OnInit, OnDestroy {
  @Input() customErrorMessages: Map<string, string> | undefined;
  @Input() placementTooltip: string | undefined;
  @Input() placementIconNotification: string | undefined;
  private refTooltip: ComponentRef<TooltipErrorComponent> | undefined;
  private refIconNotification: ComponentRef<IconNotificationComponent> | undefined;
  private containerParent: ViewContainerRef;
  private onSubmit: Observable<Event>;
  private focusEvent: Subject<boolean> = new Subject<boolean>();
  private unsubscribeObservables = new Subject<void>();
  private submitEvent: boolean = false;
  private displayTooltip: boolean = false;

  constructor(
    private vcr: ViewContainerRef,
    @Optional() controlErrorContainer: ControlErrorContainerDirective,
    @Inject(ERROR_MESSAGES) private lstErrorMessage: any,
    @Optional() @Host() private formSubmitDirective: FormSubmitDirective,
    private controlDir: NgControl,
    private host: ElementRef<HTMLFormElement>) {
    this.containerParent = controlErrorContainer ? controlErrorContainer.vcr : vcr;
    this.onSubmit = this.formSubmitDirective ? this.formSubmitDirective.submit$.pipe(tap(() => this.submitEvent = true)) : EMPTY;
  }

  ngOnDestroy(): void {
    this.unsubscribeObservables.next();
    this.unsubscribeObservables.complete();
  }

  @HostListener('focusin') addTooltip() {
    this.displayTooltip = true;
    this.focusEvent.next(true);
  }

  @HostListener('focusout') newColor() {
    this.displayTooltip = false;
    if (this.refTooltip) {
      this.refTooltip.instance.display = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:scroll', ['$event'])
  onEvent() {
    if (this.refTooltip) {
      this.refTooltip.instance.onResize(this.element.getBoundingClientRect());
    }
    if (this.refIconNotification) {
      this.refIconNotification.instance.onResize(this.containerParent.element.nativeElement.getBoundingClientRect());
    }
  }

  ngOnInit() {
    merge(
      this.onSubmit,
      this.controlDir.statusChanges!,
      this.focusEvent
    ).pipe(
      debounceTime(100),
      takeUntil(this.unsubscribeObservables)
    ).subscribe(() => {
      if (this.control) {
        const controlErrors: ValidationErrors | null = this.control.errors;
        if (controlErrors) {
          const lstErrors: string[] = [];
          Object.keys(controlErrors).forEach((errorType) => {
            let text: string | undefined;
            if (this.customErrorMessages?.get(errorType)) {
              text = this.customErrorMessages?.get(errorType);
            } else {
              try {
                text = this.lstErrorMessage[errorType](controlErrors[errorType]);
              } catch (error) {
                lstErrors.push(`This error "${errorType}" is not known in the error list.`);
              }
            }
            if (text) {
              lstErrors.push(text);
            }
          });
          this.element.classList.add('error');
          this.setError(lstErrors);
        } else if (this.refTooltip) {
          this.element.classList.remove('error');
          this.setError(undefined);
        }
      }
      this.submitEvent = false;
    });
  }

  get control(): AbstractControl | null {
    return this.controlDir.control;
  }

  setError(lstErrorMessage: string[] | undefined) {
    if (!lstErrorMessage || lstErrorMessage.length <= 0) {
      this.containerParent.clear();
      delete this.refTooltip;
      delete this.refIconNotification;
    } else {
      // Tooltip
      if (!this.submitEvent) {
        if (!this.refTooltip) {
          this.refTooltip = this.containerParent.createComponent(TooltipErrorComponent);
        }
        this.refTooltip!.instance.display = this.displayTooltip
        this.refTooltip.instance.positionParent = this.element.getBoundingClientRect();
        this.refTooltip.instance.placementTooltip = this.placementTooltip;
        this.refTooltip.instance.lstErrorMessage = lstErrorMessage;
      }

      // Icon
      const controlName = this.host.nativeElement.attributes.getNamedItem('formcontrolname')!.value;
      const id = `icon-notif-${controlName}`;
      if (!document.getElementById(id)) {
        this.refIconNotification = this.containerParent.createComponent(IconNotificationComponent);
        this.refIconNotification.instance.id = id;
      }
      if (this.refIconNotification) {
        this.refIconNotification.instance.positionParent = this.containerParent.element.nativeElement.getBoundingClientRect();
        this.refIconNotification.instance.placementIconNotification = this.placementIconNotification;
      }
    }
  }

  get element() {
    return this.host.nativeElement;
  }
}
