import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

import { TaskItemComponent } from '../../TaskItem/TaskItem.component';
import TaskList from '../../../models/TaskList';
import { StateService } from '../../../services/State.service';
import { ApiService } from '../../../services/Api.service';
import { Subject, takeUntil } from 'rxjs';
import { UtilityService } from '../../../services/Utility.service';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskItemComponent,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: 'TaskList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnDestroy { 

  @Input({required: true}) tasksList!: TaskList;
  @Input() index!: number;
  public handleColorsClass: string = this.index % 2 === 0 ? 'bg-gray text-white' : 'bg-gray text-black';
  private readonly unsubscribeAll = new Subject();

  constructor(
    private readonly stateService: StateService,
    private readonly apiService: ApiService,
    private readonly utilityService: UtilityService
  ){}

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  public openCreateTaskModal(taskListId: number): void {
    this.stateService.setTaskModalState({taskListId});
  }

  public deleteTaskList(taskListId: number): void {
    this.apiService.deleteTaskList(taskListId)
    .pipe(
        takeUntil(this.unsubscribeAll)
      ).subscribe({
        next: () => {
          this.stateService.updateTaskList.next(true);
          this.utilityService.openSnackBar('Lista deletada');
        },
        error: error => {
          console.error(error);
        }
      })
  }

}
