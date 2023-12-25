import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import Task from '../models/Task';
import { HttpClient } from '@angular/common/http';
import TaskList from '../models/TaskList';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private readonly baseUrl = environment.devUrl;
  private readonly baseUrl = 'http://localhost:8000';

  constructor(
    private readonly http: HttpClient
  ) { }

  public getAllTasksLists(): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(`${this.baseUrl}/tasksList/`);
  }

  public createTaskList({file, title}: any): Observable<TaskList> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    console.log(formData.get('file'))
    return this.http.post<TaskList>(`${this.baseUrl}/tasksList/`, formData);
  }

  public deleteTaskList(taskListId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasksList/${taskListId}/`);
  }

  public getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}/`);
  }

  public createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks/`, task);
  }

  public updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${task.id}/`, task);
  }

  public deleteTask(id: number): Observable<Task> {
    return this.http.delete<Task>(`${this.baseUrl}/tasks/${id}/`);
  }

}
