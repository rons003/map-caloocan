import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResidentInfoComponent } from '../resident-info/resident-info.component';
import { ApiService } from '../../services/api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [NgbDropdownModule, FormsModule, CommonModule],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss'
})
export class MasterDataComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private modalService = inject(NgbModal);
  closeResult = '';
  modalHeaderText: string = 'New Master Data';

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
  id: number = 0;
  residents: any[] = [];
  selectedResident: number = 0;

  action: string = 'Add';

  selectedImages!: FileList;

  constructor(private activeModal: NgbActiveModal,
    private apiService: ApiService
  ) {

  }

  getResidentInfo() {
    this.apiService.getResidentInfo(this.id)
      .subscribe(res => {
        const data = res.body;
        this.code = data.code;
        this.block = data.block;
        this.address = data.address;
        this.type = data.type;

      });
  }

  ngOnInit(): void {
    if (this.action === 'View') {
      this.getResidentInfo();
    }
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addMasterData() {

  }

  closeModal() {
    this.activeModal.close('close');
  }

  newResidentInfo() {
    const modalRef = this.modalService.open(ResidentInfoComponent, { size: 'xl', backdrop: 'static' });
    modalRef.result.then((result) => {
      if (result != 'close') {
        this.residents.push(result);
        console.log(this.residents);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.selectedImages = inputElement.files;
    }
  }

}
