import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BandService } from '../../band.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  private bandService = inject(BandService);

  bands = toSignal(this.bandService.getBands(), {
    initialValue: [],
  });

  totalConcerts = computed(() => this.bands().length);

  uniqueArtists = computed(() => new Set(this.bands().map((b) => b.name)).size);

  uniqueCities = computed(() => new Set(this.bands().map((b) => b.city)).size);

  uniqueVenues = computed(() => new Set(this.bands().map((b) => b.venue)).size);

  topArtists = computed(() => this.countBy('name').slice(0, 5));

  topCities = computed(() => this.countBy('city').slice(0, 5));

  topVenues = computed(() => this.countBy('venue').slice(0, 5));

  latestConcert = computed(() => {
    return [...this.bands()].sort((a, b) => b.date.localeCompare(a.date))[0];
  });

  firstConcert = computed(() => {
    return [...this.bands()].sort((a, b) => a.date.localeCompare(b.date))[0];
  });

  busiestYear = computed(() => {
    const years = this.bands().map((b) => b.date.slice(0, 4));
    const counts = this.countArray(years);

    return counts[0]?.label ?? 'N/A';
  });

  private countBy(key: 'name' | 'city' | 'venue') {
    const map = new Map<string, number>();

    for (const band of this.bands()) {
      const value = band[key];

      if (!value) continue;

      map.set(value, (map.get(value) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  private countArray(values: string[]) {
    const map = new Map<string, number>();

    for (const value of values) {
      map.set(value, (map.get(value) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }
}
