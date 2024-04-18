import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public authService: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  login(){
    this.authService.login(this.model).subscribe({
      next: _ => this.router.navigateByUrl('/tasks'),
    })
  }
  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
