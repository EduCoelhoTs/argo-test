import { UtilityService } from './../../services/Utility.service';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8000'
  public authenticated = signal<boolean>(false);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly utilityService: UtilityService
  ) { }

  private loginRequest(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials);
  }

  public registerRequest(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, credentials);
  }

  public login(credentials: { username: string; password: string}): void {
    this.loginRequest(credentials)
    .pipe(take(1))
    .subscribe({
       next: (response: any) => {
         if(response.access) {
          localStorage.setItem('token', response.access);
          localStorage.setItem('auth', this.utilityService.encrypt('true'));
          this.authenticated.set(true);
          this.router.navigate(['']);
         }
       },
       error: (error: any) => {
         console.log(error);
       }
    });
  }

  public isAuthenticated(): boolean {
    const auth = localStorage.getItem('auth');
    if (this.utilityService.decrypt(auth ? auth : '')) {
      return true;
    }
    return false;
  }

}
