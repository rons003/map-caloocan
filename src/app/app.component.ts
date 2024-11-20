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


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbTypeaheadModule, NgbCollapseModule, RouterLink, NgbDropdownModule, NgbCarouselModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  private modalService = inject(NgbModal);
  closeResult = '';
  map: Map | undefined;
  contextRef!: CanvasRenderingContext2D;

  residence: string[] = ['Roger Tan', 'Ronelle Siazon', 'Rey Anzures'];

  isMenuCollapsed = true;

  searchFormatter = (result: string) => result.toUpperCase();
  items = ['Ronelle Siazon', 'Roger Tan'];

  images = [944, 1011, 984].map((n) => 'assets/barangay.jpg');

  resident: string = '';

  pinDescription: boolean = false;

  background = new Image();



  ngOnInit(): void {
    const canvas = this.canvas.nativeElement;
    canvas.width = 1300;
    canvas.height = 650;
    this.background.src = "assets/map.png";
    this.background.onload = this.Render.bind(this);
  }

  Render = () => {
    //...snip doing any actual drawing for the purpose of this question
    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.drawImage(this.background, 0, 0, canvas.width, canvas.height);

    const pin = new Image();
    pin.src = "assets/pin.png";
    pin.onload = () => {
      context.drawImage(pin, 300, 500, 50, 50);
      context.font = "12px Arial";
      context.fillStyle = "purple";
      context.fillText("Roger Tan", 300, 560);
      // context.strokeText("Roger Tan", 300, 560);
    }

  }


  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === '' ? [] : this.residence.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

  open() {
    const modalRef = this.modalService.open(MasterDataComponent, { size: 'xl', backdrop: 'static' });
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
    // console.log('On Search', this.resident);
    // const pin = new Image();
    // pin.src = "assets/pin.png";
    // pin.onload = () => {
    //   const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    //   const context = canvas.getContext('2d');
    //   if (context) {
    //     context.drawImage(pin, 300, 500, 50, 50);
    //     console.log('PIN LOCATE');
    //   }
    // }

  }

  onMouseMove(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    const { x, y } = this.getMousePos(canvas, event);

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

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const canvas = this.canvas.nativeElement;
    const { x, y } = this.getMousePos(canvas, event);

  }

  onMouseUp(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  scale = 1;
  zoomIntensity = 0.1;
  zoomInOut(event: WheelEvent) {
    event.preventDefault();
    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');

    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    const wheel = event.deltaY < 0 ? 1 : -1;
    // Compute zoom factor.

    let zoom = Math.exp(wheel * this.zoomIntensity);
    this.scale = Math.min(this.scale * zoom, 30);

    if (this.scale <= 1) {
      context.resetTransform();
      this.scale = 1;
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    let t = context.getTransform();
    context.resetTransform();
    context.translate(x, y);
    context.scale(zoom, zoom);
    context.translate(-x, -y);
    context.transform(t.a, t.b, t.c, t.d, t.e, t.f);
    requestAnimationFrame(this.Render);
  }

  clickCanvas(event: MouseEvent, content: TemplateRef<any>) {
    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    const { x, y } = this.getMousePos(canvas, event);

    console.log(x, y);
    if ((x > 301 && x < 340) && (y > 501 && y < 540)) {
      console.log(x, y);
    }
  }
}
