import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, ReactiveFormsModule, FormBuilder, Form, Validators } from '@angular/forms';
import { ApiService } from '../../services/Api.service';
import { Subject, takeUntil } from 'rxjs';
import { StateService } from '../../services/State.service';
import { Route, Router } from '@angular/router';
import { UtilityService } from '../../services/Utility.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: 'Create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public file!: File | null;
  private readonly unsubscribe = new Subject();

  constructor(
    private readonly FormBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly stateService: StateService,
    private readonly router: Router,
    private readonly utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private initForm(): void {
    this.form = this.FormBuilder.group({
      title: ['', [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const payload = {
        title: this.form.value.title,
        file: this.file ? this.file : null
      }

      this.apiService.createTaskList(payload)
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: result => {
          this.stateService.updateTaskList.next(true);
          this.utilityService.openSnackBar('Lista criada com sucesso');
          this.router.navigate(['']);
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  public fileUpload(e: any): void {
    this.file = e.target.files[0];
  }

  public clearFile(): void {
    this.file = null;
  }

 }
