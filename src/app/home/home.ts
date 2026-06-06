import { Component, inject, signal, computed } from '@angular/core';
import { BandService } from '../../band.service';
import { Searchbar } from '../searchbar/searchbar';
import { MatIcon } from '@angular/material/icon';
import { AddBand } from '../add-band/add-band';
import { MatDialog } from '@angular/material/dialog';
import { Card } from '../card/card';
@Component({
  selector: 'app-home',
  imports: [Searchbar, MatIcon, AddBand, Card],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home {
  private bandService = inject(BandService);
  private dialog = inject(MatDialog);
  bands = this.bandService.getBands();

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
    let result = this.bands().filter((b) =>
      b.name.toLowerCase().includes(this.searchTerm().toLowerCase()),
    );

    if (this.sortByDate()) {
      result = [...result].sort((a, b) => b.date.localeCompare(a.date));
    }
    return result;
  });

  updateSearch(term: string) {
    this.searchTerm.set(term);
  }

  sortBandsByDate() {
    this.sortByDate.update((v) => !v);
  }

  getBandByName(band: string) {
    return this.bandService.getBandByName(band);
  }

  totalConcerts = computed(() => this.bands().length);
}
