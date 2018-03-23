import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { AccordionModule } from 'ng2-accordion';
import { WellApplicationServices } from './well-application.service';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    FormsModule,
    IonRangeSliderModule,
    AccordionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBhdhhvdxmrwApkcQ_OPHaBQz4i2-lGZPI'
    })
  ],
  providers: [
    WellApplicationServices
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
