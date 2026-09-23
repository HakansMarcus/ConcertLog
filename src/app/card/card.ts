import { Component, input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { Band } from '../band.model';
import { BandService } from '../../band.service';
import { DeleteConfirmationComponent } from '../delete-modal/delete-modal';
import { AddBand } from '../add-band/add-band';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, MatMenuModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  private bandService = inject(BandService);
  private dialog = inject(MatDialog);

  band = input.required<Band>();

  deleteRecord() {
    this.dialog
      .open(DeleteConfirmationComponent, {
        width: '380px',
        maxWidth: '92vw',
        panelClass: 'setory-dialog',
      })
      .afterClosed()
      .subscribe((result) => {
        const id = this.band().id;

        if (result && id) {
          this.bandService.deleteRecord(id);
        }
      });
  }

  protected openEditModal() {
    this.dialog.open(AddBand, {
      width: '420px',
      maxWidth: '92vw',
      data: {
        mode: 'edit',
        band: this.band(),
      },
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
    });
  }
}
