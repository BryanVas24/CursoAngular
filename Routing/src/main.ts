import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app/app.routes';
//El provideRouter te permite utilizar las rutas (Podes crearlo en un archivo aparte tambien)
bootstrapApplication(AppComponent, {
  //Si te fijas es similar a el CreatebrowserRouter
  providers: [
    provideRouter(
      //Manera uno
      /*[
      {
        path: '/tasks',
        component: TasksComponent,
      },
    ]*/
      //Manera 2, creando una clase aparte
      routes,
      //Esto es para poder tomar parametros de la url
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
  ],
}).catch((err) => console.error(err));
