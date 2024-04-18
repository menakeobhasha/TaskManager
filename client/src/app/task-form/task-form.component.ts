import { Component, EventEmitter, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskData } from 'src/_models/taskData';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup = new FormGroup({});
  formMode = '';
  task: TaskData | undefined;
  validationErrors: string[] | undefined;
  constructor(private taskService: TaskService, private toastr: ToastrService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit() {
    this.initializeForm();
    this.loadTask();
  }

  initializeForm(){
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      completed: [false]
    })
  }

  addTask(){
    const dueDate = this.getDateOnly(this.taskForm.controls['dueDate'].value);
    const values = {...this.taskForm.value, dueDate: dueDate};
    const id = this.route.snapshot.paramMap.get('id');

    if (id === '0'){
      this.taskService.addTask(values).subscribe({
        next: () => {
          this.taskForm.reset();
          this.toastr.success('Task added successfully');
        },
        error: () => this.toastr.error("Something went wrong adding the task!")
      })
    }
    else{
      this.taskService.updateTask(Number(id), values).subscribe({
        next: () => {
          this.taskForm.reset();
          this.router.navigateByUrl('/tasks');
          this.toastr.success('Task updated successfully');
        },
        error: () => this.toastr.error("Something went wrong updating the task!")
      })
    }


  }

  loadTask(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id === '0') {
      this.formMode = 'Add'
    }
    else {
      this.formMode = 'Update'
      this.taskService.getTask(Number(id)).subscribe({
        next: task => {
          this.task = task;
          this.taskForm.get('title')?.setValue(this.task.title);
          this.taskForm.get('description')?.setValue(this.task.description);
          this.taskForm.get('dueDate')?.setValue(this.datePipe.transform(this.task.dueDate, 'dd MMMM yyyy'));
          this.taskForm.get('completed')?.setValue(this.task.completed);
        },
        error: error => this.toastr.error(error.error)
      })
    }
  }

  cancel(){
    this.router.navigateByUrl('/tasks');
  }

  private getDateOnly(dueDate: string | undefined){
    if (!dueDate) return;
    let theDueDate = new Date(dueDate);
    return new Date(theDueDate.setMinutes(theDueDate.getMinutes()-theDueDate.getTimezoneOffset())).toISOString().slice(0,10)
  }
}
