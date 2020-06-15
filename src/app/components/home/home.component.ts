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
  public selectedIndex: number = null;

  public csvData: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  map: Map = null;
  mapPopup: Popup;
  @ViewChild('mapPopupEl', { static: true }) mapPopupEl: ElementRef<HTMLDivElement>;

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
    this.mapPopup = new Popup({
      closeButton: true,
      closeOnClick: false
    });

    this.map = new Map({
      container: this.mapEl.nativeElement,
      center: { lng: 78.99931, lat: 19.1193 },
      zoom: 3,
    });
    this.map.addSource('base-map-source', {
      type: 'raster',
      tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User Community'
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

    this.map.on('click', (e) => {
      const features = this.map.queryRenderedFeatures([
        [e.point.x - 5 / 2, e.point.y - 5 / 2],
        [e.point.x + 5 / 2, e.point.y + 5 / 2]
      ]);
      if (features[0]) {
        this.openPopUp(features[0]);
      }
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
          coordinates: [parseFloat(record.Longitude), parseFloat(record.Latitude)]
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
        'circle-opacity': 0.7,
        'circle-color': 'red',
        'circle-radius': [
          'let', 'area_covered',  ['to-number', ['get', 'Area_to_be_cleared_in_ha']],
          ['interpolate', ['linear'], ['var', 'area_covered'],
            0, 4,
            1000, 15,
            2000, 20]
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'],
          10, 1,
          17, 1.5,
          22, 3.5
        ]
      }
    });
    this.openPopUp();
  }



  openPopUp(featureData?: Feature) {
    if (featureData) {
      this.selectedIndex = featureData.properties.index;
    }
    const selectedData = this.csvData.features[this.selectedIndex];
    // tslint:disable-next-line: no-string-literal
    const coordinates = selectedData.geometry['coordinates'];
    this.map.flyTo({ center: coordinates });
    this.mapPopup.setLngLat(coordinates).setDOMContent(this.mapPopupEl.nativeElement).addTo(this.map);
  }


  goToMapTab() {
    this.changeTab('Map');
    this.openPopUp();
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
