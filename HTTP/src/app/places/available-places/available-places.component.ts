import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  //Esto es para inyectar el HtttpClient
  private httpClient = inject(HttpClient);
  private destroy = inject(DestroyRef);
  //Manera de hacer un get (el onInit es practicamente el useEffect)
  ngOnInit() {
    const suscription = this.httpClient
      //Tambien podes configurarlos despues de la url ,{}
      .get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(map((resdata) => resdata.places))
      .subscribe({
        next: (places) => {
          this.places.set(places);
        },
      });
    //no es necesario pero es para limpiar la suscripción http
    this.destroy.onDestroy(() => {
      suscription.unsubscribe();
    });
  }
}
