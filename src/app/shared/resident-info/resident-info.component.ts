import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Resident } from '../../model/resident.model';

@Component({
  selector: 'app-resident-info',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbAlertModule],
  templateUrl: './resident-info.component.html',
  styleUrl: './resident-info.component.scss'
})
export class ResidentInfoComponent implements OnInit {

  list_civil_status: any[] = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Separated", label: "Separated" },
    { value: "Widowed", label: "Widowed" },
  ];

  genders: any[] = [
    { value: "MALE", label: "MALE" },
    { value: "FEMALE", label: "FEMALE" }
  ];


  resident: Resident = new Resident();
  action: string = 'Add';

  modalHeaderText = 'New Resident';

  constructor(private activeModal: NgbActiveModal,
    private apiService: ApiService
  ) {

  }
  ngOnInit(): void {
    if (this.action == 'View'){
      this.modalHeaderText = 'Resident Information';
      this.getResidentInfo();
    }
  }

  getResidentInfo() {
    // this.apiService.getResidentInfo(this.id)
    //   .subscribe(res => {
    //     const data = res.body;
    //     this.first_name = data.first_name;
    //     this.middle_name = data.middle_name;
    //     this.last_name = data.last_name;
    //     this.occupation = data.occupation;
    //     this.present_address = data.present_address;
    //     this.age = data.age;
    //     this.gender = data.sex;
    //     this.nationality = data.nationality;
    //     this.civil_status = data.civil_status;
    //     this.contact_no = data.contact_no;
    //     this.emergency_name = data.emergency_name;
    //     this.emergency_address = data.address;
    //     this.emergency_contact_no = data.emergency_contact_no;
    //   });
  }

  setResident() {
    this.activeModal.close(this.resident);
  }

  closeModal() {
    this.activeModal.close('close');
  }

}
