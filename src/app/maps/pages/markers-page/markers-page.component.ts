import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerWithColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {
  @ViewChild('map') public divMap?: ElementRef;

  public map?: Map;
  public currentCoord: LngLat = new LngLat(-74.5, 40);


  public markers: MarkerWithColor[] = []

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'Elemento HTML no encontrado'

    this.map = new Map({
      container: this.divMap?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCoord, // starting position [lng, lat]
      zoom: 13
    });

    this.readMarkerFromLocalStorage();

    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Fernando Herrera'

    // const marker = new Marker({
    //   color: 'red',
    //   element: markerHtml
    // })
    //   .setLngLat(this.currentCoord)
    //   .addTo(this.map)
  }

  createMarker() {

    if (!this.map) return;
    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map?.getCenter();

    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string) {
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map)

    this.markers.push({
      color: color,
      marker: marker
    })

    this.saveMarkerToLocalStorage()
    this.flyTo(marker)

    marker.on('dragend', (event) => {
      this.saveMarkerToLocalStorage();
      console.log(marker.getLngLat());
      this.flyTo(marker)
    })
  }

  deleteMarker(i: number) {
    this.markers[i].marker.remove()
    this.markers.splice(i, 1)
    this.saveMarkerToLocalStorage();
  }

  flyTo( marker: Marker) {
    this.map?.flyTo({
      zoom: 12,
      center: marker.getLngLat()
    })
  }

  saveMarkerToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map(({color, marker}) => {
      return {
        color: color,
        lngLat: marker.getLngLat().toArray()
      }
    })
    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers))
  }

  readMarkerFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach(({ color, lngLat }) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);
      // const coords = new LngLat(lngLat[0], lngLat[1])
      this.addMarker(coords, color);
    })
  }
}
