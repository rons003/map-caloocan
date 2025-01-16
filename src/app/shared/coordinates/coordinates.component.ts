import { Component, inject, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-coordinates',
  standalone: true,
  imports: [],
  templateUrl: './coordinates.component.html',
  styleUrl: './coordinates.component.scss'
})
export class CoordinatesComponent implements OnInit {

  private modalService = inject(NgbModal);

  constructor(private activeModal: NgbActiveModal,
      private apiService: ApiService
    ) {
      
    }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close('close');
  }

}
