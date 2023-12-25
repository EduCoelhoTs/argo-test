import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import TaskList from "../models/TaskList";

interface taskModalState {
    taskListId: number;
}

interface globalState {
    taskList: TaskList
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

    private readonly taskModalState = new BehaviorSubject<taskModalState | null>(null);
    public readonly updateTaskList = new Subject<boolean>();

    public get getTaskModalState(): Observable<taskModalState | null> {
        return this.taskModalState.asObservable();
    }

    public setTaskModalState(state: taskModalState | null){
        this.taskModalState.next(state);
    }
}