import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {TooltipErrorComponent} from './tooltip-error/tooltip-error.component';
import {FormSubmitDirective} from './directive/form-submit.directive';
import {ControlErrorContainerDirective} from './directive/control-error-container.directive';
import {SvgIconComponent} from './svg-icon/svg-icon.component';
import {IconNotificationComponent} from './icon-notification/icon-notification.component';
import {FormFeedbackDirective} from "./directive/form-feedback.directive";

@NgModule({
  declarations: [
    AppComponent,
    FormFeedbackDirective,
    TooltipErrorComponent,
    FormSubmitDirective,
    ControlErrorContainerDirective,
    SvgIconComponent,
    IconNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
