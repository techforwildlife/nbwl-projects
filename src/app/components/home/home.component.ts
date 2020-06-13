import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { Converter } from 'csvtojson/v2/Converter';
import { FeatureCollection, Feature } from 'geojson';
import { NgbCarousel, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { timeStamp } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'nbwl-projects';
  public currentTab = 'Stories';
  public csvData: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };
  public selectedIndex: number = null;
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
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
