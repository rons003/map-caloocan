import { Component, inject, OnInit } from '@angular/core';
import { NgbModal, NgbDropdownModule, NgbActiveModal, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Establishment } from '../../model/establishment.model';
import { Resident } from '../../model/resident.model';
import { CustomAdapter } from '../../services/custom-adapter.service';
@Component({
  selector: 'app-home-info',
  standalone: true,
  imports: [NgbDropdownModule, FormsModule, CommonModule],
  templateUrl: './home-info.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter }
  ],
  styleUrl: './home-info.component.scss'
})
export class HomeInfoComponent implements OnInit {

  private modalService = inject(NgbModal);
  closeResult = '';
  id: number = 0;
  resident: any = {};
  age: number = 0;
  constructor(private activeModal: NgbActiveModal,
    private apiService: ApiService,
    private dateAdapter: NgbDateAdapter<string>) {

  }

  ngOnInit(): void {
    // console.log(this.resident);
    this.age = this.getAge(this.resident.birth_date);
  }

  // API CALLS

  //

  getAge(birth_date: string) {
    const date = this.dateAdapter.fromModel(birth_date);
    const year = date?.year ?? 1111;
    const day = date?.day ?? 1;
    const month = date?.month ?? 1;

    const jsDate = new Date(year, month - 1, day);
    let timeDiff = Math.abs(Date.now() - jsDate.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    return age;
  }

  closeModal() {
    this.activeModal.close('close');
  }
}
