import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { NoTaskComponent } from './tasks/no-task/no-task.component';
import { UserTasksComponent } from './users/user-tasks/user-tasks.component';
import { NewTaskComponent } from './tasks/new-task/new-task.component';
//Esto te permite definir un array de rutas
export const routes: Routes = [
  {
    //esto es el equivalente a "/"
    path: '',
    component: NoTaskComponent,
  },
  {
    path: 'users/:userId',
    component: UserTasksComponent,
    //la nested route
    children: [
      { path: 'tasks', component: TasksComponent },
      { path: 'tasks/new', component: NewTaskComponent },
    ],
  },
];
