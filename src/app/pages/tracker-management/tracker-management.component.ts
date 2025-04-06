import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { MasterDataComponent } from '../../shared/master-data/master-data.component';
import { CoordinatesComponent } from '../../shared/coordinates/coordinates.component';
import Swal from 'sweetalert2';
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
  search: string = '';

  block: number = 1;

  blocks: any[] = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
  ];

  constructor(private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.getEstablishments();

  }

  // -------------- API REQUEST ---------------------
  getEstablishments(options?: any) {
    this.apiService.getEstablishments(options)
      .subscribe(res => {
        this.establishments = res;
      });

  }

  deleteEstablishment(id: number) {
    Swal.showLoading();
    this.apiService.delete(id)
      .subscribe(res => {
        Swal.close();
        if (res.status == 'success') {
          this.getEstablishments();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
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
      if (result == 'close') {
        this.getEstablishments();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openMap(e: any) {
    const modalRef = this.modalService.open(CoordinatesComponent, { fullscreen: true, scrollable: true });
    modalRef.componentInstance.id = e.id;
    modalRef.componentInstance.code = e.code;
    modalRef.componentInstance.block = e.block;
    modalRef.componentInstance.type = e.type;
    modalRef.componentInstance.address = e.address;
    modalRef.componentInstance.polygon = e.coordinates;
    modalRef.result.then((result) => {
      if (result != 'close') {
      } else {
        this.getEstablishments();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  mapAreaDescription(coordinates: any[]): string {
    if (coordinates.length == 0) {
      return 'No';
    } else {
      return 'Yes';
    }
  }

  delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteEstablishment(id);
      }
    });
  }

  onEmptySearch() {
    if (this.search === "") {
      let options = {
        params: { block: this.block }
      }
      this.getEstablishments(options);
    }

  }

  onSearch() {
    if (this.search !== "") {
      let options = {
        params: { block: this.block, filter: this.search }
      }
      this.getEstablishments(options);
    }
  }

  onChangeBlock() {
    let options = {
      params: { block: this.block, filter: this.search }
    }
    this.getEstablishments(options);
  }

}
