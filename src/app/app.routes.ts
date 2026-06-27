import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Stats } from './stats/stats';
import { BandPage } from './bandpage/bandpage';
import { PlannedConcerts } from './plannedconcerts/plannedconcerts';
import { Login } from './login/login';
import { authGuard } from './auth.guard';
import { Privacy } from './privacy/privacy';
import { Terms } from './terms/terms';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: Home,
    canActivate: [authGuard],
  },

  {
    path: 'stats',
    component: Stats,
    canActivate: [authGuard],
  },

  {
    path: 'bandpage/:id',
    component: BandPage,
    canActivate: [authGuard],
  },

  {
    path: 'plannedconcerts',
    component: PlannedConcerts,
    canActivate: [authGuard],
  },
  {
    path: 'privacy',
    component: Privacy,
  },
  {
    path: 'terms',
    component: Terms,
  },

  {
    path: '**',
    redirectTo: '',
  },
];
