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

  ngOnInit(): void {
    const background = new Image();
    background.src = "assets/map.png";
    background.onload = () => {
      const canvas: HTMLCanvasElement = this.canvas.nativeElement;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(background, canvas.width / 2 - background.width / 2,
          canvas.height / 2 - background.height / 2);
      }
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

  open(content: TemplateRef<any>) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  onSearch() {
    console.log('On Search', this.resident);
    const pin = new Image();
    pin.src = "assets/pin.png";
    pin.onload = () => {
      const canvas: HTMLCanvasElement = this.canvas.nativeElement;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(pin, 300,500, 50, 50);
      }
    }

  }
}
