import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { Converter } from 'csvtojson/v2/Converter';
import { FeatureCollection, Feature } from 'geojson';
import { NgbCarousel, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { Map, Popup } from 'mapbox-gl';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'nbwl-projects';
  public currentTab = 'Map';
  public csvData: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };
  public selectedIndex: number = null;
  map: Map = null;
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  @ViewChild('mapEl', { static: true }) mapEl: ElementRef<HTMLDivElement>;

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
    this.initMap();
    this.dataService.getCSVData()
    .subscribe((convertorInstance: Converter) => {
      convertorInstance.then((data) => {
        this.initMapData(data);
      }, (csvError) => {
        console.error('Invalid CSV data');
        this.csvData = null;
      });
    }, (error) => {
      console.error('Unable to fetch CSV data');
      this.csvData = null;
    });
  }

  initMap() {
    this.map = new Map({
      container: this.mapEl.nativeElement,
      center: { lng: 74.1240, lat: 15.2993 },
      zoom: 10,
    });
    this.map.addSource('base-map-source', {
      type: 'raster',
      tiles: ['a', 'b', 'c']
        .map((abc) => `https://${abc}.tile.openstreetmap.org/{z}/{x}/{y}.png`)
    });
    this.map.addLayer({
      id: 'background',
      type: 'background',
      paint: {
        'background-color': 'black'
      }
    });
    this.map.addLayer({
      id: 'base-map',
      type: 'raster',
      source: 'base-map-source'
    });
  }

  initMapData(data: any[]) {
    console.log(data);
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };

    data.forEach((record, index) => {
      const feature: Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          // tslint:disable-next-line: radix
          coordinates: [parseFloat(record.Long_4dig), parseFloat(record.Lat_4dig)]
        },
        properties: { ...record, index  }
      };
      featureCollection.features.push(feature);
    });
    this.csvData = featureCollection;
    this.selectedIndex = 0;
    this.carousel.pause();
    console.log(featureCollection);
    this.map.addSource('geojson-source', {
      type: 'geojson',
      data: this.csvData
    });
    this.map.addLayer({
      id: 'geojson-layer',
      source: 'geojson-source',
      type: 'circle',
      paint: {
        'circle-opacity': 1,
        'circle-color': 'red',
        'circle-radius': ['interpolate', ['linear'], ['zoom'],
          10, 2,
          17, 3,
          22, 6
        ],
        'circle-stroke-color': 'red',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'],
          10, 2,
          17, 3,
          22, 7
        ]
      }
    });
  }

  goToLocation() {
    const selectedLocation = this.csvData.features[this.selectedIndex];
    console.log(selectedLocation);
  }

  goToMapTab() {
    this.changeTab('Map');
    this.goToLocation();
  }

  goToStoryTab() {
    this.changeTab('Stories');
    this.selectSlide(this.selectedIndex);
  }

  changeTab(name: string) {
    this.currentTab = name;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    // tslint:disable-next-line: radix
    this.selectedIndex = parseInt(slideEvent.current.split('-')[2]);
  }

  selectSlide(index: number) {
    this.carousel.select(`ngb-slide-${index}`);
  }

}
