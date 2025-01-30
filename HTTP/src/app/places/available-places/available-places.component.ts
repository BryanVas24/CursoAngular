import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isfetching = signal(false);
  error = signal('');
  //Esto es para inyectar el HtttpClient
  private httpClient = inject(HttpClient);
  private destroy = inject(DestroyRef);
  //Manera de hacer un get (el onInit es practicamente el useEffect)
  ngOnInit() {
    this.isfetching.set(true);
    const suscription = this.httpClient
      //Tambien podes configurarlos despues de la url ,{}
      .get<{ places: Place[] }>('http://localhost:3000/places')
      //pipe se usa para modificar datos antes de enviarlos al suscribe (Lo de acá no es necesario pero podes usarlos)
      .pipe(
        map((resdata) => resdata.places),
        //Asi se pueden manejar errores, pero es más complejo Xd
        catchError((error) => {
          return throwError(() => new Error('Something went wrong'));
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
