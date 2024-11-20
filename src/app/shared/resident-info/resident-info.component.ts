import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-resident-info',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbAlertModule],
  templateUrl: './resident-info.component.html',
  styleUrl: './resident-info.component.scss'
})
export class ResidentInfoComponent {

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

  first_name: string = '';
  middle_name: string = '';
  last_name: string = '';
  occupation: string = '';
  present_address: string = '';
  age: number = 2;
  gender: string = 'MALE';
  nationality: string = 'Filipino';
  civil_status: string = 'Single';
  birth_date!: NgbDateStruct;
  contact_no: string = '';
  emergency_name: string = '';
  emergency_address: string = '';
  emergency_contact_no: string = '';

  constructor(private activeModal: NgbActiveModal) {

  }

  setResident() {
    this.activeModal.close({
       "first_name": this.first_name,
       "middle_name": this.middle_name,
       "last_name": this.last_name,
       "occupation": this.occupation,
       "present_address": this.present_address,
       "age": this.age,
       "gender": this.gender,
       "nationality": this.nationality,
       "civil_status": this.civil_status,
       "birth_date": this.birth_date,
       "contact_no": this.contact_no,
       "emergency_name": this.emergency_name,
       "emergency_address": this.emergency_address,
       "emergency_contact_no": this.emergency_contact_no
    });
  }

  closeModal() {
    this.activeModal.close('close');
  }

}
