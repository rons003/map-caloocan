import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';


import { NgbTypeaheadModule, NgbCollapseModule, NgbModal, ModalDismissReasons, NgbDropdownModule, NgbCarouselModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MasterDataComponent } from '../../shared/master-data/master-data.component';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbNavModule, NgbNavModule, CommonModule, FormsModule, NgbTypeaheadModule, NgbCollapseModule, NgbDropdownModule, NgbCarouselModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('innerCanvas', { static: true }) canvas!: ElementRef;
  @ViewChild('outerCanvas', { static: true }) outerCanvas!: ElementRef;

  private modalService = inject(NgbModal);
  closeResult = '';
  contextRef!: CanvasRenderingContext2D;

  isMenuCollapsed = true;

  searchFormatter = (result: string) => result.toUpperCase();

  images = [944, 1011, 984].map((n) => 'assets/barangay.jpg');

  resident: string = '';

  pinDescription: boolean = false;

  background = new Image();

  residents: any[] = [];
  polygon: any[] = [];
  search: string = '';
  interval: any;

  constructor(private apiService: ApiService) {

  }

  //-------------------API CALLS------------------
  getResident() {
    let options = {
      params: { filter: this.search }
    }
    this.apiService.getResident(options)
      .subscribe(res => {
        this.residents = res;
      });
  }
  //----------------------------------------------

  ngOnInit(): void {
    this.getResident();
    const canvas = this.canvas.nativeElement;
    canvas.width = 1918;
    canvas.height = 2894;

    const outerCanvas = this.outerCanvas.nativeElement;
    outerCanvas.width = canvas.width;
    outerCanvas.height = canvas.height;
    this.background.src = "assets/map_new.png";
    this.background.onload = this.Render.bind(this);

  }

  Render = () => {
    //...snip doing any actual drawing for the purpose of this question
    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.drawImage(this.background, 0, 0, canvas.width, canvas.height);

  }

  track(resident: any) {

    this.modalService.dismissAll();
    this.polygon = resident.coordinates;
    let visible = true;
    this.interval = setInterval(() => {
      this.clearCanvas();
      if (visible)
        this.drawPolygon();
      visible = !visible;

    }, 500);

  }

  open() {
  
    const modalRef = this.modalService.open(MasterDataComponent, { size: 'xl', backdrop: 'static' });
    modalRef.result.then((result) => {
      if (result != 'close') {

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openMasterData(id: number, resident_id: number) {
    const modalRef = this.modalService.open(MasterDataComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.resident_id = resident_id;
    modalRef.componentInstance.action = "View";
    modalRef.result.then((result) => {
      if (result != 'close') {
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openLg(content: TemplateRef<any>) {
    if (this.interval) {
      clearInterval(this.interval);
      this.clearCanvas();
    }
    this.modalService.open(content, { size: 'xl', centered: true });
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

  onSearch() {
    this.getResident();
  }


  getMousePos(canvas: any, evt: any) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    }
  }

  drawPolygon() {
    const outerCanvas = this.outerCanvas.nativeElement;
    const context: CanvasRenderingContext2D = outerCanvas.getContext('2d');
    context.fillStyle = "rgba(63, 62, 62, 0.57)";
    context.strokeStyle = context.strokeStyle = "rgb(11, 246, 38)";
    context.lineWidth = 3;
    context.beginPath();

    for (let i = 0; i < this.polygon.length; i++) {
      context.arc(this.polygon[i].x, this.polygon[i].y, 7, 0, 2 * Math.PI);
      if (i == 0) {
        context.moveTo(this.polygon[i].x, this.polygon[i].y);
      } else {
        context.lineTo(this.polygon[i].x, this.polygon[i].y);
      }
    }
    context.fill();
    context.closePath();
    context.stroke();
  }

  clearCanvas() {
    const canvas = this.outerCanvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
