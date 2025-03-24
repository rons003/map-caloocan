import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';


import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, FormsModule, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  today: any;
  time: any;
  header: boolean = false;
  constructor(private router: Router) {
    this.today = new Date().toDateString();
    this.time = new Date().toLocaleTimeString();

    // this.router.events.subscribe((e) => {
    //   if (e instanceof NavigationEnd) {
    //     if (e.url === "/tracker-management")
    //       this.header = true;
    //   }
    // });
  }
}
