import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {


  @ViewChild('map') public divMap?: ElementRef;

  public zoom: number = 10;
  public map?: Map;
  public currentCoord: LngLat = new LngLat(-74.5, 40)

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'Elemento HTML no encontrado'

    this.map = new Map({
      container: this.divMap?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCoord, // starting position [lng, lat]
      zoom: this.zoom
    });

    this.mapListeners();
  }


  mapListeners() {
    if (!this.map) throw 'Mapa no inicializado';

    this.map.on('zoom', (event) => {
      this.zoom = this.map!.getZoom();
    })

    this.map.on('zoomend', (event) => {
      if (this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    })

    this.map.on('move', (e) => {
      console.log(e)
      this.currentCoord = this.map!.getCenter();
      // const {lng, lat} = this.currentCoord; // por si queremos extraer estas prop de forma independiente
    })
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged(value: string) {
    this.zoom = Number(value);
    this.map!.zoomTo(this.zoom);
  }

  ngOnDestroy(): void {
    this.map?.remove(); //this.map.off('move', () =>{}) para listeners individuales
  }
}
