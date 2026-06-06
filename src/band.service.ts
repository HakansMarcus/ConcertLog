import { Injectable, signal } from '@angular/core';
import { Band } from './app/band.model';
import { bands } from './app/sample-bands';

@Injectable({
  providedIn: 'root',
})
export class BandService {
  // Reactive signal holding the list of bands
  private bands = signal<Band[]>(bands);

  // Getter for Home component
  getBands() {
    return this.bands;
  }

  // Add a new band
  addBand(band: Band) {
    this.bands.update((current) => [...current, band]);
  }

  // Optional: get a band by id
  getBandById(id: number) {
    return this.bands().find((b) => b.id === id);
  }

  getBandByName(name: string) {
    return this.bands().find((b) => b.name === name);
  }

  sortBandByDate() {
    return [...this.bands()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  deleteRecord(id: number) {
    this.bands.update((current) => current.filter((b) => b.id !== id));
  }

  updateRecord(updated: Band) {
    this.bands.update((current) => current.map((b) => (b.id === updated.id ? updated : b)));
  }
}
