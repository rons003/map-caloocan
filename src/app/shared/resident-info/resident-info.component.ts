import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerModule, NgbAlertModule, NgbDateParserFormatter, NgbDateAdapter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Resident } from '../../model/resident.model';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}


@Component({
  selector: 'app-resident-info',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbAlertModule, ReactiveFormsModule],
  templateUrl: './resident-info.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
  styleUrl: './resident-info.component.scss'
})
export class ResidentInfoComponent implements OnInit {

  residentForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    middle_name: new FormControl('', Validators.required),
    occupation: new FormControl('', Validators.required),
    present_address: new FormControl({value: '', disabled: true}, Validators.required),
    gender: new FormControl('', Validators.required),
    nationality: new FormControl('', Validators.required),
    civil_status: new FormControl('', Validators.required),
    birth_date: new FormControl('', Validators.required),
    contact_no: new FormControl('', Validators.required),
    emergency_name: new FormControl('', Validators.required),
    emergency_address: new FormControl('', Validators.required),
    emergency_contact_no: new FormControl('', Validators.required)
  });

  isEdit: boolean = false;

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
    private apiService: ApiService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>
  ) {

  }
  ngOnInit(): void {

    if (this.action === 'Update') {
      this.modalHeaderText = 'Resident Information';
      this.residentForm.patchValue({
        first_name: this.resident.first_name,
        middle_name: this.resident.middle_name,
        last_name: this.resident.last_name,
        occupation: this.resident.occupation,
        gender: this.resident.gender,
        nationality: this.resident.nationality,
        civil_status: this.resident.civil_status,
        birth_date: this.resident.birth_date,
        contact_no: this.resident.contact_no,
        emergency_name: this.resident.emergency_name,
        emergency_address: this.resident.emergency_address,
        emergency_contact_no: this.resident.emergency_contact_no
      });
    }
  }
  setResident() {
    if (this.residentForm.valid) {
      const resident = new Resident();
      resident.first_name = this.residentForm.get('first_name')?.value?.toString();
      resident.last_name = this.residentForm.get('last_name')?.value?.toString();
      resident.middle_name = this.residentForm.get('middle_name')?.value?.toString();
      resident.occupation = this.residentForm.get('occupation')?.value?.toString();
      resident.gender = this.residentForm.get('gender')?.value?.toString();
      resident.nationality = this.residentForm.get('nationality')?.value?.toString();
      resident.civil_status = this.residentForm.get('civil_status')?.value?.toString();
      resident.birth_date = this.residentForm.get('birth_date')?.value?.toString();
      resident.contact_no = this.residentForm.get('contact_no')?.value?.toString();
      resident.emergency_name = this.residentForm.get('emergency_name')?.value?.toString();
      resident.emergency_address = this.residentForm.get('emergency_address')?.value?.toString();
      resident.emergency_contact_no = this.residentForm.get('emergency_contact_no')?.value?.toString();
      this.activeModal.close(resident);
    }

  }

  onClear() {
    this.residentForm.reset();
  }

  closeModal() {
    this.activeModal.close('close');
  }

}
