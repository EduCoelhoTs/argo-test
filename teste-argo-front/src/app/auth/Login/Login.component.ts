import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Subject, take } from 'rxjs';
import { AuthService } from '../services/Auth.service';
import { UtilityService } from '../../services/Utility.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './Login.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  private readonly unsubscribeAll = new Subject();
  public isLogin: boolean = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly utilityService: UtilityService
  ){}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    if(this.form.valid) {
      this.authService.login(this.form.value);
    }
  }

  public handleRegisterLogin(): void {
    this.isLogin = !this.isLogin;
  }

  public register(credentials: { username: string; password: string}): void {
    this.authService.registerRequest(credentials)
    .pipe(take(1))
    .subscribe({
       next: (response: any) => {
          this.utilityService.openSnackBar('Usuário criado com sucesso!')
          this.isLogin = true;
          this.form.reset();
       },
       error: (error: any) => {
        this.utilityService.openSnackBar('Erro' + error.username[0])
       }
    });
  }

  public onRegister() {
    if(this.form.valid) {
      this.register(this.form.value);
    }
  }


}
