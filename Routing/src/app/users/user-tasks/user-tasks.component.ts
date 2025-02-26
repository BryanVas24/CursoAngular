import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-user-tasks',
  standalone: true,
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
  imports: [RouterOutlet],
})
export class UserTasksComponent implements OnInit {
  //obteniendo parametros de la URL
  userName = '';
  userId = input.required<string>();
  private userService = inject(UsersService);
  private activedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  //forma nueva
  /*userName = computed(
    () => this.userService.users.find((u) => u.id === this.userId())?.name
  );*/

  //forma vieja
  ngOnInit(): void {
    const suscription = this.activedRoute.paramMap.subscribe({
      next: (paramMap) =>
        (this.userName =
          this.userService.users.find((u) => u.id === paramMap.get('userId'))
            ?.name || ''),
    });
    this.destroyRef.onDestroy(() => suscription.unsubscribe());
  }
}
