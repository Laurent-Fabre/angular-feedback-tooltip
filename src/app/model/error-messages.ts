import {InjectionToken} from '@angular/core';

export const defaultErrors = {
  required: () => `This field is required`,
  minlength: ({
                requiredLength,
                actualLength
              }: { requiredLength: number, actualLength: number }) => `Expect ${requiredLength} but got ${actualLength}`,
  maxlength: ({
                requiredLength,
                actualLength
              }: { requiredLength: number, actualLength: number }) => `Expect ${requiredLength} but got ${actualLength}`,
  pattern: ({requiredPattern}: { requiredPattern: string }) => `This field does not respect the pattern : \n ${requiredPattern}.`,
  email: () => `Invalid Email.`
}

export const ERROR_MESSAGES = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors
});

