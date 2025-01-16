import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResidentInfoComponent } from '../resident-info/resident-info.component';
import { ApiService } from '../../services/api.service';
import { AsyncSubject, Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

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

  code: string = '';
  block: number = 1;
  address: string = '';
  type: string = 'Residential';
  id: number = 0;
  resident_id: number = 0;
  residents: any[] = [];
  selectedResident: number = 0;

  action: string = 'Add';

  selectedImages!: FileList;

  constructor(private activeModal: NgbActiveModal,
    private apiService: ApiService
  ) {
    
  }

  imagesBase64: string[] = []

  public selectedFiles: SelectedFiles[] = [];

  public toFilesBase64(files: File[], selectedFiles: SelectedFiles[]): Observable<SelectedFiles[]> {
    const result = new AsyncSubject<SelectedFiles[]>();
    if (files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          selectedFiles = selectedFiles?.filter(f => f?.name != files[i]?.name)
          selectedFiles.push({ name: files[i]?.name, file: files[i], base64: reader?.result as string })
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

  addMasterData() {
    Swal.showLoading();
    const data = {
      "code": this.code,
      "block": this.block,
      "address": this.address,
      "type": this.type,
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

      }, error => {
        Swal.close();
      });
  }

  getMasterData() {
    this.apiService.getMasterData(this.id)
      .subscribe(res => {
        const data = res.body;
        this.code = data.code;
        this.block = data.block;
        this.address = data.address;
        this.type = data.type;
        this.residents = data.residents
        this.resident_id = data.residents[0].id
        this.selectedResident = this.residents.findIndex(o=> o.id == this.resident_id);
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

  newResidentInfo() {
    const modalRef = this.modalService.open(ResidentInfoComponent, { size: 'xl', backdrop: 'static' });
    modalRef.result.then((result) => {
      if (result != 'close') {
        this.residents.push(result);
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
      });
    }
  }

  deleteResident(){
    this.residents.splice(this.selectedResident, 1);
    this.selectedResident = 0;
  }

}
