import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { BandService } from '../../band.service';
import { Searchbar } from '../searchbar/searchbar';
import { AddBand } from '../add-band/add-band';
import { DeleteConfirmationComponent } from '../delete-modal/delete-modal';
import { Band } from '../band.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-plannedconcerts',
  standalone: true,
  imports: [Searchbar, MatIcon, MatMenuModule, MatIconModule],
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
    return this.bands()
      .filter((band) => band.status === 'planned')
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  filteredUpcomingConcerts = computed(() => {
    const term = this.searchTerm().toLowerCase();

    return this.upcomingConcerts().filter((band) => band.name.toLowerCase().includes(term));
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
      data: {
        status: 'planned',
      },
    });
  }

  editConcert(concert: Band) {
    this.dialog.open(AddBand, {
      width: '420px',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
      data: {
        mode: 'edit',
        band: concert,
      },
    });
  }

  deleteConcert(concert: Band) {
    if (!concert.id) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
    });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (!confirmed) return;

      await this.bandService.deleteRecord(concert.id!);
    });
  }

  async markAsAttended(concert: Band) {
    await this.bandService.updateRecord({
      ...concert,
      status: 'attended',
    });
  }

  daysUntil(dateString: string): number {
    const today = new Date();
    const concertDate = new Date(dateString);

    const diff = concertDate.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
