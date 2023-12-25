import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { StateService } from '../../services/State.service';
import { ApiService } from '../../services/Api.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { UtilityService } from '../../services/Utility.service';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './CreateTaskDialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskDialogComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  private readonly unsubscribeAll = new Subject();

  constructor(
    private readonly dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly stateService: StateService,
    private readonly utilityService: UtilityService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
      status: ['Aberto'],
      taskList: [this.data.taskListId]
    });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public submitForm(): void {
    if(this.form.valid) {
      this.apiService.createTask(this.form.value)
      .pipe(
        takeUntil(this.unsubscribeAll))
      .subscribe({
        next: task => {
          this.stateService.updateTaskList.next(true);
          this.utilityService.openSnackBar('Tarefa criada com sucesso')
          this.dialogRef.close(task);
        },
        error: err => console.warn(err)
      });
    }
  }

 }
