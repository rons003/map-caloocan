import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResidentInfoComponent } from '../resident-info/resident-info.component';
import { ApiService } from '../../services/api.service';
import { AsyncSubject, Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Resident } from '../../model/resident.model';
import { Establishment } from '../../model/establishment.model';
import jsPDF from 'jspdf';
import { right } from '@popperjs/core';


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


  constructor(private activeModal: NgbActiveModal,
    private apiService: ApiService
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

  generateBarangayClearance() {

    const margins = {
      top: 10,
      left: 10,
      right: 10

    };
    const doc = new jsPDF({
      format: 'a4',
      unit: 'px'
    });

    const logo1 = new Image();
    logo1.src = "assets/along logo.png";

    const logo2 = new Image();
    logo2.src = "assets/citycaloocan.png";

    doc.addImage(logo1, margins.left, margins.top, 75, 75);
    doc.addImage(logo2, 360, margins.top, 75, 75);
    doc.setFont('Times');
    doc.setFontSize(18);
    doc.text("REPUBLIC OF THE PHILIPPINES\nBARANGAY 132, ZONE 12, DISTRICT 1\nCITY OF CALOOCAN", 223, 27, { align: 'center', lineHeightFactor: 1.3 });
    doc.setTextColor("#008000");
    doc.text("OFFICE OF THE PUNONG BARANGAY", 223, 79, { align: 'center' })
    doc.setLineWidth(20);
    doc.line(margins.left, 105, 435, 105);
    

    // const pdfString = doc.output('datauristring');
    doc.save('brgyclearance.pdf');
    // window.open(pdfString, "_blank");
  }

}
