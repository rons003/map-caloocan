import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tracker-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './tracker-management.component.html',
  styleUrl: './tracker-management.component.scss'
})
export class TrackerManagementComponent implements OnInit {

  establishments: any[] = [];

  constructor(private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.getEstablishments();

  }

  // -------------- API REQUEST ---------------------
  getEstablishments() {
    this.apiService.getEstablishments()
      .subscribe(res => {
        this.establishments = res;
      });

  }
  // ------------------------------------------------

}
