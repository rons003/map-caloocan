import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResidentInfoComponent } from '../resident-info/resident-info.component';
import { ApiService } from '../../services/api.service';
import { AsyncSubject, Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Resident } from '../../model/resident.model';
import { Establishment } from '../../model/establishment.model';
import jsPDF from 'jspdf';
import { ResidentInfoAttachmentComponent } from '../resident-info-attachment/resident-info-attachment.component';
import { CustomAdapter } from '../../services/custom-adapter.service';
import { CustomDateParserFormatter } from '../../services/custom-adapter-formatter.service';


export interface SelectedFiles {
  name: string;
  file: any;
  base64?: string;
}

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [NgbDropdownModule, FormsModule, CommonModule],
  templateUrl: './master-data.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
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
  id: number = 0;
  action: string = 'Add';

  establishment: Establishment = new Establishment();
  residents: Resident[] = [];
  selectedResident: number = 0;



  selectedImages!: FileList;
  imagesBase64: string[] = []
  o: Resident | undefined;

  parameters = {
    name: '',
    age: '',
    street: '',
    relation: '',
    purpose: ''
  };


  constructor(private activeModal: NgbActiveModal,
    private apiService: ApiService,
    private dateAdapter: NgbDateAdapter<string>
  ) {

  }

  addMasterData() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.showLoading();
        const data = {
          "code": this.establishment.code,
          "block": this.establishment.block,
          "address": this.establishment.address,
          "type": this.establishment.type,
          "residents": this.residents,
          "images": this.selectedFiles
        };
        this.apiService.addMasterData(data)
          .subscribe(res => {
            Swal.close();
            if (res.status == 'success') {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: res.message,
                showConfirmButton: false,
                timer: 1500
              });
              this.closeModal();
            } else {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: res.message,
                showConfirmButton: false,
                timer: 1500
              });
            }

          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });

  }

  update() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.showLoading();
        const data = {
          "code": this.establishment.code,
          "block": this.establishment.block,
          "address": this.establishment.address,
          "type": this.establishment.type,
          "residents": this.residents,
          "images": this.selectedFiles
        };
        this.apiService.updateMasterData(this.id, data)
          .subscribe(res => {
            Swal.close();
            if (res.status == 'success') {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: res.message,
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: res.message,
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });

  }

  getMasterData() {
    this.apiService.getMasterData(this.id)
      .subscribe(res => {
        const data = res.body;
        this.establishment.code = data.code;
        this.establishment.block = data.block;
        this.establishment.address = data.address;
        this.establishment.type = data.type;
        this.residents = data.residents
        this.establishment.image = "data:image/jpg;base64, " + data.image;
      });
  }

  ngOnInit(): void {
    if (this.action === 'View') {
      this.modalHeaderText = "Master Data Information"
      this.getMasterData();
    }
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  closeModal() {
    this.activeModal.close('close');
  }

  ResidentInfo(action: string) {
    const modalRef = this.modalService.open(ResidentInfoComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.address = this.establishment.address;
    if (action === 'Update') {
      modalRef.componentInstance.isEdit = true;
      modalRef.componentInstance.resident = this.residents[this.selectedResident];
    }

    modalRef.result.then((result) => {
      if (result != 'close') {
        if (action === 'Add')
          this.residents.push(result);
        else
          this.residents[this.selectedResident] = result;
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openResidentInfoAttachment() {
    const modalRef = this.modalService.open(ResidentInfoAttachmentComponent, { fullscreen: true });
    modalRef.componentInstance.img_src = "data:image/jpg;base64, " + this.residents[this.selectedResident].attachment;

    modalRef.result.then((result) => {
      if (result != 'close') {

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  onImageSelected(event: Event): void {
    this.selectedFiles = [];
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.selectedImages = inputElement.files;
      const files = Array.from(this.selectedImages);
      this.toFilesBase64(files, this.selectedFiles).subscribe((res: SelectedFiles[]) => {
        this.selectedFiles = res;
        this.establishment.image = "data:image/jpg;base64, " + this.selectedFiles[0].base64;
      });
    }
  }

  deleteResident() {
    this.residents.splice(this.selectedResident, 1);
    this.selectedResident = 0;
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

  disableCode() {
    if (this.action === 'View')
      return true;
    else
      return false;
  }

  async generateBarangayClearance() {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Purpose",
      inputPlaceholder: "Type your purpose here...",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });
    if (text) {
      const today = new Date();
      const doc = new jsPDF({
        format: 'a4',
        unit: 'px'
      });

      const resident = this.residents[this.selectedResident];
      const fullName = resident.last_name?.toString() + ", "
        + resident.first_name?.toString() + " "
        + resident.middle_name?.toString()

      const address = resident.present_address?.toString() ?? "";
      const birth_date = resident.birth_date?.toString() ?? "";
      const civil_status = resident.civil_status?.toString() ?? "";
      const gender = resident.gender?.toString() ?? "";
      const nationality = resident.nationality?.toString() ?? "";
      const id_no = resident.id_no ?? "";

      const template = new Image();
      template.src = "assets/template_clearance.jpg";
      doc.addImage(template, 0, 0, 445, 600);

      doc.setFontSize(10);
      doc.text(today.toDateString(), 115, 223.5);
      doc.text(id_no, 115, 245.5);
      doc.text(fullName.toUpperCase(), 115, 268.5);
      doc.text(address.toUpperCase(), 115, 290.5);
      doc.text(birth_date, 115, 312.5);
      doc.text(civil_status.toUpperCase(), 115, 335.5);
      doc.text(gender.toUpperCase(), 115, 357.5);
      doc.text(nationality.toUpperCase(), 115, 380.5);
      doc.text(text.toUpperCase(), 115, 402.5);

      doc.save(resident.last_name?.toString() + "_" + resident.first_name?.toString() + "_"
        + resident.middle_name?.toString() + "_BRGY_CLEARANCE.pdf");
    }

  }

  async generateBarangayResidency() {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Purpose",
      inputPlaceholder: "Type your purpose here...",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });
    if (text) {
      const today = new Date();
      const doc = new jsPDF({
        format: 'a4',
        unit: 'px'
      });
      const resident = this.residents[this.selectedResident];
      const fullName = resident.last_name?.toString() + ", "
        + resident.first_name?.toString() + " "
        + resident.middle_name?.toString()

      const address = resident.present_address?.toString() ?? "";
      const birth_date = resident.birth_date?.toString() ?? "";
      const civil_status = resident.civil_status?.toString() ?? "";
      const gender = resident.gender?.toString() ?? "";
      const nationality = resident.nationality?.toString() ?? "";
      const id_no = resident.id_no ?? "";
      const template = new Image();
      template.src = "assets/template_brgy_residency.jpg";
      doc.addImage(template, 0, 0, 445, 600);

      doc.setFontSize(10);
      doc.text(today.toDateString(), 115, 223.5);
      doc.text(id_no, 115, 245.5);
      doc.text(fullName.toUpperCase(), 115, 268.5);
      doc.text(address.toUpperCase(), 115, 290.5);
      doc.text(birth_date, 115, 312.5);
      doc.text(civil_status.toUpperCase(), 115, 335.5);
      doc.text(gender.toUpperCase(), 115, 357.5);
      doc.text(nationality.toUpperCase(), 115, 380.5);
      doc.text(text.toUpperCase(), 115, 402.5);

      doc.save(resident.last_name?.toString() + "_" + resident.first_name?.toString() + "_"
        + resident.middle_name?.toString() + "_BRGY_RESIDENCY.pdf");
    }

  }

  async generateBarangayIndigency() {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Purpose",
      inputPlaceholder: "Type your purpose here...",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });
    if (text) {
      const today = new Date();
      const doc = new jsPDF({
        format: 'a4',
        unit: 'px'
      });
      const resident = this.residents[this.selectedResident];
      const fullName = resident.last_name?.toString() + ", "
        + resident.first_name?.toString() + " "
        + resident.middle_name?.toString();

      const address = resident.present_address?.toString() ?? "";
      const birth_date = resident.birth_date?.toString() ?? "";
      const civil_status = resident.civil_status?.toString() ?? "";
      const gender = resident.gender?.toString() ?? "";
      const nationality = resident.nationality?.toString() ?? "";
      const id_no = resident.id_no ?? "";

      const template = new Image();
      template.src = "assets/template_brgy_indigency.jpg";
      doc.addImage(template, 0, 0, 445, 600);

      doc.setFontSize(10);
      doc.text(today.toDateString(), 115, 223.5);
      doc.text(id_no, 115, 245.5);
      doc.text(fullName.toUpperCase(), 115, 268.5);
      doc.text(address.toUpperCase(), 115, 290.5);
      doc.text(birth_date, 115, 312.5);
      doc.text(civil_status.toUpperCase(), 115, 335.5);
      doc.text(gender.toUpperCase(), 115, 357.5);
      doc.text(nationality.toUpperCase(), 115, 380.5);
      doc.text(text.toUpperCase(), 115, 402.5);

      doc.save(resident.last_name?.toString() + "_" + resident.first_name?.toString() + "_"
        + resident.middle_name?.toString() + "_BRGY_INDIGENCY.pdf");
    }

  }

  async generateCertIndigency() {
    const doc = new jsPDF({
      format: 'a4',
      unit: 'px'
    });
    const today = new Date();
    const resident = this.residents[this.selectedResident];
    const fullName = resident.last_name?.toString() + ", "
        + resident.first_name?.toString() + " "
        + resident.middle_name?.toString();
    const template = new Image();
    template.src = "assets/template_cert_indigency.jpg";
    doc.addImage(template, 0, 0, 445, 600);

    doc.setFontSize(12);
    doc.text(this.parameters.name.toUpperCase(), 250, 155, { align: 'center' });
    doc.text(this.parameters.age, 358, 155);
    doc.text(this.parameters.street.toUpperCase(), 300, 173, { align: 'center' });
    doc.text(fullName.toUpperCase(), 310, 228, { align: 'center' });
    doc.text(this.parameters.relation.toUpperCase(), 110, 245, { align: 'center' });
    doc.text(this.parameters.purpose.toUpperCase(), 275, 245, { align: 'center' });

    doc.text(today.toDateString(), 152, 271, { align: 'center' });
    doc.save(resident.last_name?.toString() + "_" + resident.first_name?.toString() + "_"
      + resident.middle_name?.toString() + "_CERT_INDIGENCY.pdf");

  }

  getAge(birth_date: string) {
    const date = this.dateAdapter.fromModel(birth_date);
    const year = date?.year ?? 1111;
    const day = date?.day ?? 1;
    const month = date?.month ?? 1;

    const jsDate = new Date(year, month - 1, day);
    let timeDiff = Math.abs(Date.now() - jsDate.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    return age;
  }

  openCertIndigency(content: TemplateRef<any>) {
    this.parameters.name = "";
    this.parameters.age = "";
    this.parameters.street = "";
    this.parameters.relation = "";
    this.parameters.purpose = "";
		this.modalService.open(content, { size: 'sm', centered: true });
	}

}
