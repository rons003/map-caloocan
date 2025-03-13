import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coordinates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coordinates.component.html',
  styleUrl: './coordinates.component.scss'
})
export class CoordinatesComponent implements OnInit {
  @ViewChild('innerCanvas', { static: true }) canvas!: ElementRef;
  @ViewChild('outerCanvas', { static: true }) outerCanvas!: ElementRef;
  background = new Image();

  isDrawing: boolean = false;
  polygon: any[] = [];

  id: number = 0;
  code: string = '';
  block: string = '';
  type: string = '';
  address: string = '';

  private modalService = inject(NgbModal);

  constructor(private activeModal: NgbActiveModal,
    private apiService: ApiService
  ) {

  }

  // ----------------- API REQUEST ---------------------
  saveCoordinates() {
    Swal.showLoading();
    let data = {
      "establishment_id": this.id,
      "coordinates": this.polygon
    };
    this.apiService.storeCoordinates(data)
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
  // ---------------------------------------------------

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement;
    canvas.width = 1918;
    canvas.height = 2894;

    const outerCanvas = this.outerCanvas.nativeElement;
    outerCanvas.width = canvas.width;
    outerCanvas.height = canvas.height;
    this.background.src = "assets/map_new2.png";
    this.background.onload = this.Render.bind(this);
    this.drawPolygon();
  }

  Render = () => {
    //...snip doing any actual drawing for the purpose of this question
    const canvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.drawImage(this.background, 0, 0, canvas.width, canvas.height);

  }

  closeModal() {
    this.activeModal.close('close');
  }

  selectArea() {
    this.clearCanvas();
    this.polygon = [];
    if (this.isDrawing)
      this.isDrawing = false;
    else
      this.isDrawing = true;

  }

  reset() {
    this.polygon = [];
    this.clearCanvas();
    this.isDrawing = false;
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

  clickCanvas(event: Event) {
    if (this.isDrawing) {
      const canvas = this.outerCanvas.nativeElement;
      const { x, y } = this.getMousePos(canvas, event);
      this.polygon.push({
        x: x,
        y: y
      });
      this.drawPolygon();
    }
  }

  drawPolygon() {
    const outerCanvas = this.outerCanvas.nativeElement;
    const context: CanvasRenderingContext2D = outerCanvas.getContext('2d');
    this.clearCanvas();
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

  disableSave(): boolean {
    if (this.polygon.length > 2) {
      return false;
    } else {
      return true;
    }
  }

}
