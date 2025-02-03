import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../places.service';

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
  private FetchedPlaces = inject(PlacesService);
  private destroy = inject(DestroyRef);

  ngOnInit() {
    this.isfetching.set(true);
    const suscription = this.FetchedPlaces.loadUserPlaces().subscribe({
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
