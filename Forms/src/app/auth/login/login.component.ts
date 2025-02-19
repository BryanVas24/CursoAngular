import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
//Ejemplo de validator manual
function mustContainsQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesnotContainsQuestionMark: true };
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //Este get se usa porque la validación en el if de la plantilla era muy larga
  get emailIsInvalidCondition() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
  get passwordInvalidCondition() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }
  //Es una instancia de un FormGroup
  form = new FormGroup({
    //Para añadir validaciones podes usar un [] de validators o {} configuración
    //Los validators son funciones built-in o construidas manualmente
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      //Solo pasas el nombre de la función porque Angular la va a ejecutar por vos

      validators: [
        Validators.minLength(6),
        Validators.required,
        mustContainsQuestionMark,
      ],
    }),
  });
  onSubmit() {
    //Esto es para hacer validaciones pero es avanzado
    //this.form.controls.email.addValidators
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}
