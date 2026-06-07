import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import Chart from 'chart.js/auto';
import * as L from 'leaflet';

import { BandService } from '../../band.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats implements AfterViewInit {
  private bandService = inject(BandService);

  @ViewChild('yearChart') yearChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('artistChart') artistChartRef!: ElementRef<HTMLCanvasElement>;

  private yearChart?: Chart;
  private artistChart?: Chart;

  private map?: L.Map;
  private markersLayer?: L.LayerGroup;

  /**CHANGE TO GET THE LON / LAT THROUGH API */

  cityCoordinates: Record<string, [number, number]> = {
    Stockholm: [59.3293, 18.0686],
    Göteborg: [57.7089, 11.9746],
    Luleå: [65.5848, 22.1547],
    Sundsvall: [62.3908, 17.3069],
    Eskilstuna: [59.3712, 16.5098],
    Rättvik: [60.8863, 15.1179],
    Furuvik: [60.6506, 17.3371],
    Sandviken: [60.6216, 16.7755],
    Söderhamn: [61.3037, 17.0592],
    Uppsala: [59.8586, 17.6389],
  };

  bands = toSignal(this.bandService.getBands(), {
    initialValue: [],
  });

  constructor() {
    effect(() => {
      const yearData = this.concertsPerYear();

      if (this.yearChart) {
        this.yearChart.data.labels = yearData.map((x) => x.label);
        this.yearChart.data.datasets[0].data = yearData.map((x) => x.count);
        this.yearChart.update();
      }

      const artistData = this.topArtists();

      if (this.artistChart) {
        this.artistChart.data.labels = artistData.map((x) => x.label);
        this.artistChart.data.datasets[0].data = artistData.map((x) => x.count);
        this.artistChart.update();
      }

      this.updateMapMarkers();
    });
  }

  ngAfterViewInit() {
    const yearData = this.concertsPerYear();

    this.yearChart = new Chart(this.yearChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: yearData.map((x) => x.label),
        datasets: [
          {
            label: 'Concerts',
            data: yearData.map((x) => x.count),
            borderRadius: 8,
          },
        ],
      },
      options: this.chartOptions,
    });

    const artistData = this.topArtists();

    this.artistChart = new Chart(this.artistChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: artistData.map((x) => x.label),
        datasets: [
          {
            label: 'Times Seen',
            data: artistData.map((x) => x.count),
            borderRadius: 8,
          },
        ],
      },
      options: this.chartOptions,
    });

    this.initMap();
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#bbe1fa',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#bbe1fa',
        },
        grid: {
          color: 'rgba(187, 225, 250, 0.08)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#bbe1fa',
          precision: 0,
        },
        grid: {
          color: 'rgba(187, 225, 250, 0.08)',
        },
      },
    },
  };

  totalConcerts = computed(() => this.bands().length);

  uniqueArtists = computed(() => new Set(this.bands().map((b) => b.name)).size);

  uniqueCities = computed(() => new Set(this.bands().map((b) => b.city)).size);

  uniqueVenues = computed(() => new Set(this.bands().map((b) => b.venue)).size);

  topArtists = computed(() => this.countBy('name').slice(0, 5));

  topCities = computed(() => this.countBy('city').slice(0, 5));

  topVenues = computed(() => this.countBy('venue').slice(0, 5));

  latestConcert = computed(() => [...this.bands()].sort((a, b) => b.date.localeCompare(a.date))[0]);

  firstConcert = computed(() => [...this.bands()].sort((a, b) => a.date.localeCompare(b.date))[0]);

  busiestYear = computed(() => {
    const years = this.bands().map((b) => b.date.slice(0, 4));
    const counts = this.countArray(years);

    return counts[0]?.label ?? 'N/A';
  });

  concertsPerYear = computed(() => {
    const years = this.bands().map((b) => b.date.slice(0, 4));

    return this.countArray(years).sort((a, b) => a.label.localeCompare(b.label));
  });

  private initMap() {
    this.map = L.map('concertMap', {
      scrollWheelZoom: false,
    }).setView([60.1282, 18.6435], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    this.updateMapMarkers();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }

  private updateMapMarkers() {
    if (!this.map || !this.markersLayer) return;

    this.markersLayer.clearLayers();

    for (const city of this.topCities()) {
      const coords = this.cityCoordinates[city.label];

      if (!coords) continue;

      L.circleMarker(coords, {
        radius: Math.max(8, Math.min(city.count * 1.2, 34)),
        fillColor: '#c13383',
        color: '#bbe1fa',
        fillOpacity: 0.75,
        weight: 2,
      })
        .bindPopup(
          `
          <strong>${city.label}</strong><br>
          ${city.count} concerts
        `,
        )
        .addTo(this.markersLayer);
    }
  }

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
