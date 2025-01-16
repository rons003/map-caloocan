import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { MasterDataComponent } from '../../shared/master-data/master-data.component';
@Component({
  selector: 'app-tracker-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule, NgbModalModule, NgbPagination],
  templateUrl: './tracker-management.component.html',
  styleUrl: './tracker-management.component.scss'
})
export class TrackerManagementComponent implements OnInit {
  private modalService = inject(NgbModal);
  establishments: any[] = [];

  page: number = 1;
  pageSize: number = 10;

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

  open() {
    const modalRef = this.modalService.open(MasterDataComponent, { size: 'xl', backdrop: 'static' });
    modalRef.result.then((result) => {
      if (result != 'close') {

      } else {
        this.getEstablishments();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openMasterData(id: number) {
    const modalRef = this.modalService.open(MasterDataComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.action = "View";
    modalRef.result.then((result) => {
      if (result != 'close') {
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  

}
