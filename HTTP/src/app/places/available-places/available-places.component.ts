import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

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
  //Esto llama a una función de un servicio
  private Places = inject(PlacesService);
  private destroy = inject(DestroyRef);

  onSelectPlace(selectedPlace: Place) {
    //Asi se hace un put
    this.Places.addPlaceToUserPlaces(selectedPlace.id).subscribe({
      complete: () => {
        console.log('Place added to user places!');
      },
      error: (err: Error) => {
        this.error.set('We can´t add to your favorites places :(');
      },
    });
  }

  //Manera de hacer un get (el onInit es practicamente el useEffect)
  ngOnInit() {
    this.isfetching.set(true);
    const suscription = this.Places.loadAvailablePlaces().subscribe({
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
