import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BandService } from '../../band.service';
import { Searchbar } from '../searchbar/searchbar';
import { MatIcon } from '@angular/material/icon';
import { AddBand } from '../add-band/add-band';
import { MatDialog } from '@angular/material/dialog';
import { Card } from '../card/card';

@Component({
  selector: 'app-home',
  imports: [Searchbar, MatIcon, Card],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home {
  private bandService = inject(BandService);
  sortDirection = signal<'desc' | 'asc'>('desc');
  private dialog = inject(MatDialog);

  bands = toSignal(this.bandService.getBands(), {
    initialValue: [],
  });

  searchTerm = signal('');
  sortByDate = signal(false);

  protected openModal() {
    this.dialog.open(AddBand, {
      width: '420px',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
    });
  }

  filteredBands = computed(() => {
    const term = this.searchTerm().toLowerCase();

    let result = this.bands().filter((b) => b.name.toLowerCase().includes(term));

    result = [...result].sort((a, b) => {
      return this.sortDirection() === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    });

    return result;
  });

  updateSearch(term: string) {
    this.searchTerm.set(term);
  }

  sortBandsByDate() {
    this.sortDirection.update((direction) => (direction === 'desc' ? 'asc' : 'desc'));
  }

  totalConcerts = computed(() => this.bands().length);
}
