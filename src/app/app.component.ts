import { AfterViewInit, Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as ol from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import Vector from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { NgbTypeaheadModule, NgbCollapseModule, NgbModal, ModalDismissReasons, NgbDropdownModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MasterDataComponent } from './shared/master-data/master-data.component';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { ResidentInfoComponent } from './shared/resident-info/resident-info.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, NgbTypeaheadModule, NgbCollapseModule, RouterLink, NgbDropdownModule, NgbCarouselModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('innerCanvas', { static: true }) canvas!: ElementRef;
  @ViewChild('outerCanvas', { static: true }) outerCanvas!: ElementRef;

  private modalService = inject(NgbModal);
  closeResult = '';
  map: Map | undefined;
  contextRef!: CanvasRenderingContext2D;

  isMenuCollapsed = true;

  searchFormatter = (result: string) => result.toUpperCase();

  images = [944, 1011, 984].map((n) => 'assets/barangay.jpg');

  resident: string = '';

  pinDescription: boolean = false;

  background = new Image();

  residents: any[] = [];
  search: string = '';
  today: any;
  time: any;
  constructor(private apiService: ApiService) {
    this.today = new Date().toDateString();
    this.time = new Date().toLocaleTimeString();
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
    context.fillStyle = "rgba(244, 4, 4, 0.57)";
    context.strokeStyle = "yellow";
    context.lineWidth = 5;
    context.beginPath();

    context.moveTo(648, 1276);
    context.lineTo(646, 1418);
    context.lineTo(873, 1420);
    context.lineTo(873, 1271);

    context.fill();
    context.closePath();
    context.stroke();

  }

  Render = () => {
    //...snip doing any actual drawing for the purpose of this question
    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    // context.fillStyle = "rgba(244, 4, 4, 0.57)";
    // context.strokeStyle = "yellow";
    // context.lineWidth = 5;
    // context.beginPath();

    // context.moveTo(648,1276);
    // context.lineTo(646,1418);
    // context.lineTo(873,1420);
    // context.lineTo(873,1271);

    // context.fill();
    // context.closePath();
    // context.stroke();

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

  clickCanvas(event: Event, content: TemplateRef<any>) {
    const canvas = this.outerCanvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    const { x, y } = this.getMousePos(canvas, event);
    if (context.isPointInPath(x, y)) {

      this.openLg(content)
      this.clearCanvas(context, canvas);
    }
  }

  clearCanvas(context: CanvasRenderingContext2D, canvas: any) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
