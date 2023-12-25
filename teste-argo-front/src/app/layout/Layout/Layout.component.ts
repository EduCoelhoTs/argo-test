import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/Auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: 'Layout.component.html',
  styleUrl: './Layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent { 

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  public auth = this.authService.authenticated;

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    this.authService.authenticated.set(false);
    this.router.navigate(['/login']);
  }
}
