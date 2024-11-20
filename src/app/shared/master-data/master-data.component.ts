import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [NgbDropdownModule, FormsModule, CommonModule],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss'
})
export class MasterDataComponent implements OnInit, OnDestroy {

  blocks: any[] = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 1, label: 4 },
  ];

  types: any[] = [
    { value: "Residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
    { value: "Apartment", label: "Apartment" },
    { value: "Others", label: "Others" },
  ]

  code: string = '';
  block: number = 1;
  address: string = '';
  type: string = 'Residential';

  residents: any[] = [];

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
