import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
//Esto te permite definir un array de rutas
export const routes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
  },
];
