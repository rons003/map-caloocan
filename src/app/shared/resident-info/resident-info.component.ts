import { CommonModule } from '@angular/common';
import { Component, inject, Injectable, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerModule, NgbAlertModule, NgbDateParserFormatter, NgbDateAdapter, NgbCalendar, NgbModal, NgbModalModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Resident } from '../../model/resident.model';
import { AsyncSubject, Observable } from 'rxjs';

export interface SelectedFiles {
  name: string;
  file: any;
  base64?: string;
}

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
  imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbAlertModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './resident-info.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
  styleUrl: './resident-info.component.scss'
})
export class ResidentInfoComponent implements OnInit {

  private modalService = inject(NgbModal);
	closeResult: WritableSignal<string> = signal('');

  residentForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    middle_name: new FormControl('', Validators.required),
    occupation: new FormControl('', Validators.required),
    present_address: new FormControl({ value: '', disabled: true }, Validators.required),
    gender: new FormControl('', Validators.required),
    nationality: new FormControl('', Validators.required),
    civil_status: new FormControl('', Validators.required),
    birth_date: new FormControl('', Validators.required),
    contact_no: new FormControl('', Validators.required),
    emergency_name: new FormControl('', Validators.required),
    emergency_address: new FormControl('', Validators.required),
    emergency_contact_no: new FormControl('', Validators.required)
  });

  img_src: string = '';

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
  address: string = '';

  selectedImages!: FileList;
  imagesBase64: string[] = []

  constructor(private activeModal: NgbActiveModal
  ) {
  
  }
  ngOnInit(): void {
    this.residentForm.patchValue({present_address: this.address});
    if (this.isEdit) {
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
      this.img_src = "data:image/jpg;base64, " + this.resident.attachment;
    }
  }
  setResident() {
    if (this.residentForm.valid) {
      const resident = new Resident();
      resident.first_name = this.residentForm.get('first_name')?.value?.toString();
      resident.last_name = this.residentForm.get('last_name')?.value?.toString();
      resident.middle_name = this.residentForm.get('middle_name')?.value?.toString();
      resident.present_address = this.residentForm.get('present_address')?.value?.toString();
      resident.occupation = this.residentForm.get('occupation')?.value?.toString();
      resident.gender = this.residentForm.get('gender')?.value?.toString();
      resident.nationality = this.residentForm.get('nationality')?.value?.toString();
      resident.civil_status = this.residentForm.get('civil_status')?.value?.toString();
      resident.birth_date = this.residentForm.get('birth_date')?.value?.toString();
      resident.contact_no = this.residentForm.get('contact_no')?.value?.toString();
      resident.emergency_name = this.residentForm.get('emergency_name')?.value?.toString();
      resident.emergency_address = this.residentForm.get('emergency_address')?.value?.toString();
      resident.emergency_contact_no = this.residentForm.get('emergency_contact_no')?.value?.toString();
      resident.files = this.selectedFiles[0];
      resident.attachment = this.selectedFiles[0].base64?.toString();
      this.activeModal.close(resident);
    }

  }

  onClear() {
    this.residentForm.reset();
  }

  closeModal() {
    this.activeModal.close('close');
  }

  onImageSelected(event: Event): void {
    this.selectedFiles = [];
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.selectedImages = inputElement.files;
      const files = Array.from(this.selectedImages);
      this.toFilesBase64(files, this.selectedFiles).subscribe((res: SelectedFiles[]) => {
        this.selectedFiles = res;
        // this.resident.attachment = "data:image/jpg;base64, " + this.selectedFiles[0].base64;
      });
    }
  }

  public selectedFiles: SelectedFiles[] = [];

  public toFilesBase64(files: File[], selectedFiles: SelectedFiles[]): Observable<SelectedFiles[]> {
    const result = new AsyncSubject<SelectedFiles[]>();
    if (files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          let b64string = reader?.result as string;
          b64string = b64string.replace(/^data:image\/[a-z]+;base64,/, "");
          selectedFiles = selectedFiles?.filter(f => f?.name != files[i]?.name)
          selectedFiles.push({ name: files[i]?.name, file: files[i], base64: b64string })
          result.next(selectedFiles);
          if (files?.length === (i + 1)) {
            result.complete();
          }
        };
      });
      return result;
    } else {
      result.next([]);
      result.complete();
      return result;
    }
  }

  public onFileSelected(files: File[]) {
    // this.selectedFiles = []; // clear
    this.toFilesBase64(files, this.selectedFiles).subscribe((res: SelectedFiles[]) => {
      this.selectedFiles = res;
    });
  }


  open(content: TemplateRef<any>) {
		this.modalService.open(content, { fullscreen: true }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

}
