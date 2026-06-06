import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Stats } from './stats/stats';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },

  {
    path: 'stats',
    component: Stats,
  },
];
