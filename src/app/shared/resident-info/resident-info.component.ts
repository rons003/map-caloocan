import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbAlertModule],
  templateUrl: './resident-info.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
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
    private apiService: ApiService,
    private ngbCalendar: NgbCalendar,
		private dateAdapter: NgbDateAdapter<string>
  ) {

  }
  ngOnInit(): void {

    if (this.action === 'Update') {
      this.modalHeaderText = 'Resident Information';

    }
  }
  setResident() {
    this.activeModal.close(this.resident);
  }

  closeModal() {
    this.activeModal.close('close');
  }

}
