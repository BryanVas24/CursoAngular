import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

function comparePasswords(control: AbstractControl) {
  //Asi se obtiene el valor, el get te permite obtener un elemento
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password === confirmPassword) {
    return null;
  }
  return { passwordsNotEqual: true };
}
@Component({
  selector: 'app-signup',
  standalone: true,
  //Super importante
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    //Podes usar FormGroups dentro de formGroups
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.minLength(6), Validators.required],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.minLength(6), Validators.required],
      }),
    }),

    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormGroup(
      {
        street: new FormControl('', {
          validators: [Validators.required],
        }),
        number: new FormControl('', {
          validators: [Validators.required, Validators.maxLength(8)],
        }),
        postalCode: new FormControl('', {
          validators: [Validators.required],
        }),
        city: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      { validators: [comparePasswords] }
    ),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    //el select
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', { validators: [Validators.required] }),
    agree: new FormControl(false, { validators: [Validators.required] }),
  });

  onSubmit() {
    //Si algun elemento del form es invalido
    if (this.form.invalid) {
      console.log('Invalid form');
      return;
    }
  }
  onReset() {
    this.form.reset();
  }
}
