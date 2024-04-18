import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskData } from 'src/_models/taskData';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  baseUrl = environment.apiUrl;
  tasks: TaskData[] = [];

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<TaskData[]>(this.baseUrl + 'tasks');
  }

  deleteTask(id: number) {
    return this.http.delete(this.baseUrl + 'tasks/' + id);
  }
  addTask(model: any) {
    return this.http.post<TaskData>(this.baseUrl + 'tasks', model);
  }
  getTask(id: number) {
    return this.http.get<TaskData>(this.baseUrl + 'tasks/' + id);
  }
  updateTask(id: number, model: any){
    return this.http.put(this.baseUrl + 'tasks/' + id, model)
  }
}
