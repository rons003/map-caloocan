import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';


import { NgbTypeaheadModule, NgbCollapseModule, NgbModal, ModalDismissReasons, NgbDropdownModule, NgbCarouselModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MasterDataComponent } from '../../shared/master-data/master-data.component';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HomeInfoComponent } from '../../shared/home-info/home-info.component';
import { Resident } from '../../model/resident.model';
import { Establishment } from '../../model/establishment.model';
import Swal from 'sweetalert2';

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
  birthdays: any[] = [];
  polygon: any[] = [];
  search: string = '';
  interval: any;
  image: string = '';
  type: string = '';

  block: number = 1;

  blocks: any[] = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
  ];

  src_male_avatar: string = 'assets/male_avatar.jpg';
  src_female_avatar: string = 'assets/female_avatar.jpg';
  constructor(private apiService: ApiService) {

  }

  //-------------------API CALLS------------------
  getResident() {
    let options = {
      params: { block: this.block, filter: this.search }
    }
    this.apiService.getResident(options)
      .subscribe(res => {
        this.residents = res;
      });
  }

  getBirthDateAlert() {
    this.apiService.getBirthDateAlert()
    .subscribe(res => {
      this.birthdays = res;
    });
  }
  //----------------------------------------------

  ngOnInit(): void {
    this.getResident();
    this.getBirthDateAlert();
    const canvas = this.canvas.nativeElement;
    canvas.width = 1918;
    canvas.height = 2894;

    const outerCanvas = this.outerCanvas.nativeElement;
    outerCanvas.width = canvas.width;
    outerCanvas.height = canvas.height;
    this.background.src = "assets/map_new2.png";
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
    this.image = "data:image/jpg;base64, " + resident.image;
    this.type = resident.type;
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

  async openResidentInfo(resident: any) {

    const { value: password } = await Swal.fire({
      title: "Enter your password",
      input: "password",
      inputLabel: "Password",
      inputPlaceholder: "Enter your password",
      inputAttributes: {
        maxlength: "10",
        autocapitalize: "off",
        autocorrect: "off"
      },
      inputValidator: (result) => {
        if (result !== "krm132")
          return "Incorrect Password!";
        return !result && "You need to enter a password";

      }
    });
    if (password == "krm132") {
      this.setWithExpiry("info_access", "Yes", 300000);
      const modalRef = this.modalService.open(HomeInfoComponent, { size: 'xl', centered: true });
      modalRef.componentInstance.resident = resident;
      modalRef.result.then((result) => {
        if (result != 'close') {
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  openLg(content: TemplateRef<any>) {
    this.block = 1;
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


  clickCanvas(event: Event, content: TemplateRef<any>) {
    const outerCanvas = this.outerCanvas.nativeElement;
    const innerCanvas = this.canvas.nativeElement;
    const context: CanvasRenderingContext2D = outerCanvas.getContext('2d');
    const innerContext: CanvasRenderingContext2D = innerCanvas.getContext('2d');
    const { x, y } = this.getMousePos(outerCanvas, event);
    let selected = context.isPointInPath(x, y);
    if (selected) {
      // const image = new Image();
      // image.src = "assets/barangay.jpg";
      // innerContext.drawImage(image, x, y, 150, 150);
      this.modalService.open(content, { centered: true, size: 'xl' });

    }
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
    context.fillStyle = "rgba(226, 88, 13, 0.57)";
    context.strokeStyle = context.strokeStyle = "rgb(246, 97, 11)";
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

  setWithExpiry(key: string, value: string, ttl: any) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }

  openAbout(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'xl' });

  }

  openBirthdays(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'xl' });
  }
}
