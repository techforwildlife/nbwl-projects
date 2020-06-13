import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppIconsModule } from './app.icons.module';
import { DataService } from 'src/services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppIconsModule,
    HttpClientModule,
    NgbCarouselModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
