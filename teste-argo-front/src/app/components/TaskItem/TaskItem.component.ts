import { ApiService } from './../../services/Api.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import Task from '../../models/Task';
import { Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { StateService } from '../../services/State.service';
import { UtilityService } from '../../services/Utility.service';

@Component({
  selector: 'task-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: 'TaskItem.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent implements OnInit, OnDestroy { 

  @Input({required: true}) task!: Task;
  public form!: FormGroup;
  private readonly unsubscribeAll = new Subject();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ApiService: ApiService,
    private readonly stateService: StateService,
    private readonly utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadForm();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      status: [false]
    });
  }

  private loadForm(): void {
    this.form.patchValue({
      status: this.task.status === 'Aberto' ? false : true
    })
  }

  public updateStatus(): void {
    const newTask = {...this.task, status: this.form?.get('status')?.value ? 'Concluído': 'Aberto'}
    this.ApiService
    .updateTask(newTask)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe({
      next: () => {
        
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  public deleteTask(): void {
    this.ApiService
    .deleteTask(this.task.id)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe({
      next: () => {
        this.stateService.updateTaskList.next(true);
        this.utilityService.openSnackBar('Tarefa deletada');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
