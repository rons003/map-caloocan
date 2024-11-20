import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss'
})
export class MasterDataComponent implements OnInit, OnDestroy {

  constructor(private activeModal: NgbActiveModal) {
    
  }

  ngOnInit(): void {
  }


  ngOnDestroy(): void {
  }

  closeModal() {
    this.activeModal.close('close');
  }

}
