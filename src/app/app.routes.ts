import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Stats } from './stats/stats';
import { BandPage } from './bandpage/bandpage';
import { Login } from './login/login';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

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

  {
    path: '**',
    redirectTo: '',
  },
];
