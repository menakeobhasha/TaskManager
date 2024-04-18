import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Task Manager';
  constructor(private authService: AuthService){}
  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.authService.setCurrentUser(user);
  }

}
