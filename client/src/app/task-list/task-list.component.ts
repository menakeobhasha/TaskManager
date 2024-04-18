import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { TaskData } from 'src/_models/taskData';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskData[] = [];
  data: TaskData[] = [];
  sortByField: string = '';
  reverseSort: boolean = false;
  constructor(private taskService: TaskService, private toastr: ToastrService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(){
    this.taskService.getTasks().subscribe({
      next: response => {
        this.tasks = response;
        this.data = response;
      },
      error: error => this.toastr.error(error.error)
    })
  }

  sortTasks(field: string) {
    if (this.sortByField === field) {
      // If already sorting by this field, toggle the sorting direction
      this.reverseSort = !this.reverseSort;
    } else {
      // If sorting by a new field, reset reverseSort to false
      this.reverseSort = false;
    }

    // Update the sorting field
    this.sortByField = field;

    // Sorting logic
    this.tasks.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return this.reverseSort ? 1 : -1; // Reverse sorting if needed
      }
      if (a[field] > b[field]) {
        return this.reverseSort ? -1 : 1; // Reverse sorting if needed
      }
      return 0;
    });
  }

  onChange(event: any): void {
    var data = event.target.value;
    if (data.length > 0) {
      this.tasks = this.data.filter(task =>
        task.title.toLowerCase().includes(data.toLowerCase()) ||
        task.description.toLowerCase().includes(data.toLowerCase())
      );
    }else{
      this.tasks = this.data;
    }
  }

  deleteTask(id: number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to delete this task?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id).subscribe({
          next: _ => {
            this.loadTasks();
            this.toastr.success('Task removed successfully');
          },
          error: error => this.toastr.error("Something went wrong deleting the task!")
        })
      }
    });
  }

}
