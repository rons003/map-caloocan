import { Component, inject, OnInit } from '@angular/core';
import { NgbModal, NgbDropdownModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Establishment } from '../../model/establishment.model';
import { Resident } from '../../model/resident.model';
@Component({
  selector: 'app-home-info',
  standalone: true,
  imports: [NgbDropdownModule, FormsModule, CommonModule],
  templateUrl: './home-info.component.html',
  styleUrl: './home-info.component.scss'
})
export class HomeInfoComponent implements OnInit {

  private modalService = inject(NgbModal);
  closeResult = '';
  id: number = 0;
  resident: any = {};
  constructor(private activeModal: NgbActiveModal,
    private apiService: ApiService) {

  }

  ngOnInit(): void {
    // console.log(this.resident);
  }

  // API CALLS

  //

  closeModal() {
    this.activeModal.close('close');
  }
}
