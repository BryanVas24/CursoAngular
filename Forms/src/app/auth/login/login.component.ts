import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';
//Ejemplo de validator manual
function mustContainsQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesnotContainsQuestionMark: true };
}
//Este es un validator asincrono, por lop que podrias validar si el usuario no existe
function emailIsUnique(control: AbstractControl) {
  //El email esta hard codeado por ejemplo
  if (control.value === 'test@example.com') {
    return of({ emailIsrepeated: true });
  }
  return of(null);
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
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
      asyncValidators: [emailIsUnique],
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
  ngOnInit(): void {
    const savedForm = window.localStorage.getItem('saved-login-form');

    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      //Sirve para cactualizar un form parcialmente
      this.form.patchValue({
        email: loadedForm.email,
      });
    }
    const suscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => suscription.unsubscribe());
  }
  onSubmit() {
    //Esto es para hacer validaciones pero es avanzado
    //this.form.controls.email.addValidators
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}
