import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskData } from 'src/_models/taskData';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: TaskData | undefined;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.loadTask();
  }

  loadTask(){
    const id = this.route.snapshot.paramMap.get('id');
    this.taskService.getTask(Number(id)).subscribe({
      next: task => {
        this.task = task;
      }
    })
  }
  cancel(){
    this.router.navigateByUrl('/tasks')
  }

}
