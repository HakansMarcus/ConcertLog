import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Stats } from './stats/stats';
import { BandPage } from './bandpage/bandpage';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },

  {
    path: 'stats',
    component: Stats,
  },

  {
    path: 'bandpage/:id',
    component: BandPage,
  },
];
