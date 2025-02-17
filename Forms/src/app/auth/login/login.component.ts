import { afterNextRender, Component, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  constructor() {
    //Esto se ejecuta hasta que el formulario este construido
    afterNextRender(() => {
      //Esto miralo como un handler change
      const suscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({
                email: value.email,
              })
            ),
        });
    });
  }
  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    //Así se obtiene el contenido del form
    const email = formData.form.value.email;
    const password = formData.form.value.password;
    //Esto resetea el formulario
    formData.form.reset();
  }
}
