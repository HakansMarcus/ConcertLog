import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BandService } from '../../band.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private bandService = inject(BandService);
  private router = inject(Router);

  async login() {
    await this.bandService.loginWithGoogle();
    this.router.navigate(['/']);
  }
}
