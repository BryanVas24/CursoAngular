import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);

  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'We can´t add to your favorites places :('
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Something went wrong adding your favorite place'
    ).pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces),
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    if (!prevPlaces.some((existPlace) => existPlace.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.httpClient
      .put('http://localhost:3000/user-places', {
        placeId: place.id,
      })
      .pipe(
        catchError((error) => {
          this.userPlaces.set(prevPlaces);
          return throwError(
            () => new Error('failed to store the selected place')
          );
        })
      );
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errorMessage: string) {
    return (
      this.httpClient
        //Tambien podes configurarlos despues de la url ,{}
        .get<{ places: Place[] }>(url)
        //pipe se usa para modificar datos antes de enviarlos al suscribe (Lo de acá no es necesario pero podes usarlos)
        .pipe(
          map((resdata) => resdata.places),
          //Asi se pueden manejar errores, pero es más complejo Xd
          catchError((error: Error) => {
            return throwError(() => new Error(errorMessage));
          })
        )
    );
  }
}
