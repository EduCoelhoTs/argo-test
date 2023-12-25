import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

import { Observable, Subject, take, takeUntil } from 'rxjs';
import TaskList from '../../models/TaskList';
import { ApiService } from '../../services/Api.service';
import { TaskListComponent } from '../../components/TaskList/TaskList/TaskList.component';
import { CreateTaskDialogComponent } from '../../components/CreateTaskDialog/CreateTaskDialog.component';
import { StateService } from '../../services/State.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TaskListComponent,
    MatDialogModule
  ],
  templateUrl: './List.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, OnDestroy {

  public tasksList = signal<TaskList[] | null>(null);
  private readonly unsubscribeAll = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private readonly dialog: MatDialog,
    private readonly stateService: StateService,
  ){}

   ngOnInit(): void {
    this.getTasksList();
    this.handleUpdateTaskList();
    this.handleOpenCreateTaskModal();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private getTasksList(): void{
    this.apiService.getAllTasksLists()
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe({
      next: response => {
        this.tasksList.set(response);
      },
      error: err => console.error(err)
    });
  }

  private handleUpdateTaskList(): void {
    this.stateService.updateTaskList.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: () => {
        this.getTasksList();
      },
      error: err => console.error(err)
    });
  }

  private openCreateTaskModal(taskListId: number) {

    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '40%',
      data: {
        taskListId
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stateService.setTaskModalState(null)
      }
    });
  }

  private handleOpenCreateTaskModal() {
    this.stateService.getTaskModalState
    .pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe({
      next: state => {
        if (state) {
          this.openCreateTaskModal(state['taskListId'])
        }
      }, 
      error: err => console.warn(err)
    })
  }


}
