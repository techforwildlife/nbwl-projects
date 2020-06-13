import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { Converter } from 'csvtojson/v2/Converter';
import { FeatureCollection, Feature } from 'geojson';

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
  public activeItemIndex = null;

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

    data.forEach((record) => {
      const feature: Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          // tslint:disable-next-line: radix
          coordinates: [parseFloat(record.Long_4dig), parseFloat(record.Lat_4dig)]
        },
        properties: record
      };
      featureCollection.features.push(feature);
    });
    this.csvData = featureCollection;
    this.activeItemIndex = 0;
    console.log(featureCollection);
  }

  goToMap() {
    this.changeTab('Map');
  }

  changeTab(name: string) {
    this.currentTab = name;
  }

  previousItem() {
    if (this.activeItemIndex !== 0) {
      this.activeItemIndex--;
    }
  }

  nextItem() {
    if (this.activeItemIndex < this.csvData.features.length - 1) {
      this.activeItemIndex++;
    }
  }

}
