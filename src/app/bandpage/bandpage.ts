import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BandService } from '../../band.service';
import { Band } from '../band.model';

@Component({
  selector: 'app-band-details',
  standalone: true,
  imports: [],
  templateUrl: './bandpage.html',
  styleUrl: './bandpage.css',
})
export class BandPage {
  private route = inject(ActivatedRoute);
  private bandService = inject(BandService);

  band = signal<Band | undefined>(undefined);
  loading = signal(true);
  uploading = signal(false);
  selectedPhoto = signal<string | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadBand(id);
    }
  }

  async loadBand(id: string | number) {
    this.loading.set(true);

    const result = await this.bandService.getBandById(id);

    this.band.set(result);
    this.loading.set(false);
  }

  async uploadPhotos(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    const currentBand = this.band();

    if (!files.length || !currentBand?.id) return;

    this.uploading.set(true);

    try {
      await this.bandService.uploadBandPhotos(currentBand.id, files);

      const refreshedBand = await this.bandService.getBandById(currentBand.id);
      this.band.set(refreshedBand);

      input.value = '';
    } finally {
      this.uploading.set(false);
    }
  }

  async deletePhoto(photoUrl: string, event: Event) {
    event.stopPropagation();

    if (!this.band()?.id) return;

    await this.bandService.deleteBandPhoto(this.band()!.id!, photoUrl);

    const refreshedBand = await this.bandService.getBandById(this.band()!.id!);
    this.band.set(refreshedBand);
  }
}
