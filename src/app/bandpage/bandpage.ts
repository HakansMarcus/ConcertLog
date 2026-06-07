import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  selectedPhoto = signal<string | null>(null);

  band = signal<Band | undefined>(undefined);
  loading = signal(true);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadBand(id);
    }
  }

  async loadBand(id: string) {
    this.loading.set(true);

    const result = await this.bandService.getBandById(id);

    this.band.set(result);
    this.loading.set(false);
  }

  async uploadPhotos(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (!files.length || !this.band()?.id) return;

    await this.bandService.uploadBandPhotos(this.band()!.id!, files);

    const refreshedBand = await this.bandService.getBandById(this.band()!.id!);
    this.band.set(refreshedBand);

    input.value = '';
  }
}
