import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //Es una instancia de un FormGroup
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  onSubmit() {
    this.form.value.email;
  }
}
