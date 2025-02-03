import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isfetching = signal(false);
  error = signal('');
  //Esto es para inyectar el HtttpClient
  private httpClient = inject(HttpClient);
  private destroy = inject(DestroyRef);

  ngOnInit() {
    this.isfetching.set(true);
    const suscription = this.httpClient
      //Tambien podes configurarlos despues de la url ,{}
      .get<{ places: Place[] }>('http://localhost:3000/user-places')
      //pipe se usa para modificar datos antes de enviarlos al suscribe (Lo de acá no es necesario pero podes usarlos)
      .pipe(
        map((resdata) => resdata.places),
        //Asi se pueden manejar errores, pero es más complejo Xd
        catchError((error: Error) => {
          return throwError(
            () => new Error('Something went wrong adding a favorite place')
          );
        })
      )
      .subscribe({
        next: (places) => {
          this.places.set(places);
        },
        //Se ejecuta si hay un error en la suscripción
        error: (err: Error) => {
          this.error.set(err?.message);
        },
        //Se ejecuta una vez todo el proceso termine
        complete: () => {
          this.isfetching.set(false);
        },
      });
    //no es necesario pero es para limpiar la suscripción http
    this.destroy.onDestroy(() => {
      suscription.unsubscribe();
    });
  }
}
