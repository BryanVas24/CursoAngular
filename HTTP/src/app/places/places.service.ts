import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService);
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
          this.errorService.showError('failed to store the selected place');
          return throwError(
            () => new Error('failed to store the selected place')
          );
        })
      );
  }

  removeUserPlace(place: Place) {
    const prevPlacesd = this.userPlaces();
    if (prevPlacesd.some((existPlace) => existPlace.id === place.id)) {
      this.userPlaces.set([...prevPlacesd.filter((p) => p.id !== place.id)]);
    }

    return this.httpClient
      .delete(`http://localhost:3000/user-places/${place.id}`)
      .pipe(
        catchError((error) => {
          this.userPlaces.set(prevPlacesd);
          this.errorService.showError(
            'An error ocurred while removing the selected place'
          );
          return throwError(() => new Error('failed to delete the place'));
        })
      );
  }

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
