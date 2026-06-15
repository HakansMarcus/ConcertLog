import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { BandService } from '../../band.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  bandService = inject(BandService);
  private router = inject(Router);

  async logout() {
    await this.bandService.logout();
    this.router.navigate(['/login']);
  }
}
