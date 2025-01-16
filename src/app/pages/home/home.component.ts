import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';


import { NgbTypeaheadModule, NgbCollapseModule, NgbModal, ModalDismissReasons, NgbDropdownModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MasterDataComponent } from '../../shared/master-data/master-data.component';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTypeaheadModule, NgbCollapseModule, NgbDropdownModule, NgbCarouselModule, FormsModule],
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
  search: string = '';

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
    this.background.src = "assets/map2.png";
    this.background.onload = this.Render.bind(this);


    const context: CanvasRenderingContext2D = outerCanvas.getContext('2d');

    // context.fillStyle = "rgba(244, 4, 4, 0.57)";
    // context.strokeStyle = "yellow";
    // context.lineWidth = 5;
    // context.beginPath();

    // context.moveTo(648, 1276);
    // context.lineTo(646, 1418);
    // context.lineTo(873, 1420);
    // context.lineTo(873, 1271);

    // context.fill();
    // context.closePath();
    // context.stroke();

  }

  Render = () => {
    //...snip doing any actual drawing for the purpose of this question
    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.drawImage(this.background, 0, 0, canvas.width, canvas.height);

  }

  highlightArea () {
    console.log('high light area');
    const outerCanvas = this.outerCanvas.nativeElement;
    const context: CanvasRenderingContext2D = outerCanvas.getContext('2d');
    this.clearCanvas(context, outerCanvas);
    
    // requestAnimationFrame(this.highlightArea);
  }

  track() {
    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    const pin = new Image();
    pin.src = "assets/pin.png";
    pin.onload = () => {
      context.drawImage(pin, 300, 500, 50, 50);
      context.font = "12px Arial";
      context.fillStyle = "purple";
      context.fillText("Jaybee Cruz", 300, 560);
    }
    this.modalService.dismissAll();
  }


  // search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map((term) =>
  //       term === '' ? [] : this.residence.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
  //     ),
  //   );

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

  polygon: any[] = [];

  clickCanvas(event: Event, content: TemplateRef<any>) {
    const canvas = this.outerCanvas.nativeElement;
    const { x, y } = this.getMousePos(canvas, event);
    this.polygon.push({
      x: x,
      y: y
    });
    this.drawPolygon();
    console.log(this.polygon);
  }

  drawPolygon() {
    const outerCanvas = this.outerCanvas.nativeElement;
    const context: CanvasRenderingContext2D = outerCanvas.getContext('2d');
    this.clearCanvas(context, outerCanvas);
    context.fillStyle = "rgba(63, 62, 62, 0.57)";
    context.strokeStyle = "rgba(193, 29, 29, 0.7)";
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

  clearCanvas(context: CanvasRenderingContext2D, canvas: any) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
