import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nbwl-projects';
  public currentTab = 'Stories';

  changeTab(name: string) {
    this.currentTab = name;
  }

}
