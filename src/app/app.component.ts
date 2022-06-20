import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {blue} from "./model/color-validator";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'angular-feedback-tooltip';
  form: FormGroup | undefined;
  customErrors: Map<string, string> = new Map<string, string>([
    ["required", "Please accept the terms"]
  ]);
  customErrorsColor: Map<string, string> = new Map<string, string>([
    ["wrongColor", "The color should be blue"]
  ]);

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      terms: [false, Validators.requiredTrue],
      address: this.formBuilder.group({
        city: ['', Validators.required],
        country: ['', Validators.required]
      }),
      gender: [null, Validators.required],
      age: [null, Validators.required],
      color: [null, blue()]
    });
  }
}
