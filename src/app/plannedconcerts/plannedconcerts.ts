import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { BandService } from '../../band.service';
import { Searchbar } from '../searchbar/searchbar';
import { AddBand } from '../add-band/add-band';

@Component({
  selector: 'app-plannedconcerts',
  standalone: true,
  imports: [Searchbar],
  templateUrl: './plannedconcerts.html',
  styleUrl: './plannedconcerts.css',
})
export class PlannedConcerts {
  private bandService = inject(BandService);
  private dialog = inject(MatDialog);

  bands = toSignal(this.bandService.getBands(), {
    initialValue: [],
  });

  searchTerm = signal('');

  upcomingConcerts = computed(() => {
    const today = new Date().toISOString().split('T')[0];

    return this.bands()
      .filter((band) => band.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  filteredUpcomingConcerts = computed(() => {
    return this.upcomingConcerts().filter((band) =>
      band.name.toLowerCase().includes(this.searchTerm().toLowerCase()),
    );
  });

  nextConcert = computed(() => this.upcomingConcerts()[0]);

  updateSearch(term: string) {
    this.searchTerm.set(term);
  }

  openModal() {
    this.dialog.open(AddBand, {
      width: '420px',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
    });
  }

  daysUntil(dateString: string): number {
    const today = new Date();
    const concertDate = new Date(dateString);

    const diff = concertDate.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
