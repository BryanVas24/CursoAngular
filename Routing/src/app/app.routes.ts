import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { NoTaskComponent } from './tasks/no-task/no-task.component';
//Esto te permite definir un array de rutas
export const routes: Routes = [
  {
    //esto es el equivalente a "/"
    path: '',
    component: NoTaskComponent,
  },
  {
    path: 'tasks',
    component: TasksComponent,
  },
];
