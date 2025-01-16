import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { NgbTypeaheadModule, NgbCollapseModule, NgbModal, ModalDismissReasons, NgbDropdownModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MasterDataComponent } from './shared/master-data/master-data.component';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { ResidentInfoComponent } from './shared/resident-info/resident-info.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  today: any;
  time: any;
  constructor() {
    this.today = new Date().toDateString();
    this.time = new Date().toLocaleTimeString();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
