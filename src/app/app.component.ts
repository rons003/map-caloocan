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
import { NgbTypeaheadModule, NgbCollapseModule, NgbModal, ModalDismissReasons, NgbCarouselModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbTypeaheadModule, NgbCollapseModule, RouterLink, NgbCarouselModule, NgbAccordionModule],
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

  ngOnInit(): void {
    // const background = new Image();
    // background.src = "assets/bbd52733-45f6-46e0-9e1d-02fbf9e7eb36.jpg";
    // background.onload = () => {
    //   const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    //   const context = canvas.getContext('2d');
    //   if (context) {
    //     context.drawImage(background, 0, 0);
    //   }
    // }

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
      ],
      view: new View({
        center: ol.fromLonLat([120.9909, 14.6633]),
        zoom: 19,
        minZoom: 16
      })
    });

    this.map.on("click", this.mapClick);

    const iconFeature = new Feature({
      geometry: new Point(ol.fromLonLat([120.9909, 14.6633])),
      name: 'Somewhere near Nottingham',
    });
    const marker = new VectorLayer({
      source: new Vector({
        features: [iconFeature]
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'https://openlayers.org/en/latest/examples/data/icon.png'
        })
      })
    })
    this.map?.addLayer(marker)

  }

  mapClick(event: any) {
    
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
}
