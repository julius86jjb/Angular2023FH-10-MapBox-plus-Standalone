import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css'],
})
export class MiniMapComponent implements AfterViewInit{

  @Input() lngLat?: [number, number]
  @ViewChild('map') divMap?: ElementRef;

  public map?: Map;



  ngAfterViewInit(): void {
    if(!this.divMap?.nativeElement) throw "Map not found";

    if (!this.lngLat) throw "LngLat null";

    this.map = new Map({
      container: this.divMap?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.lngLat,
      zoom: 15,
      interactive: false,
    });
    new Marker()
      .setLngLat(this.lngLat)
      .addTo(this.map)
    // this.createMarker();
  }


  // createMarker() {

  //   if (!this.map) return;
  //   const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
  //   const lngLat = this.map?.getCenter();

  //   this.addMarker(lngLat, color);
  // }

  // addMarker(lngLat: LngLat, color: string) {
  //   if (!this.map) return;

  //   const marker = new Marker({
  //     color: color,
  //     draggable: true
  //   })
  //     .setLngLat(lngLat)
  //     .addTo(this.map)
  // }
}
