import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from "angular2-google-maps/core";
import { AppComponent } from './app.component';
import { GetweatherService } from './services/getweather.service';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import exporting from 'highcharts/modules/exporting.src.js';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCwHezlGAAOhqxlzOnTnoJUaX27cGh1Icw",
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    ChartModule,
  ],
  providers: [GetweatherService,{
    provide: HIGHCHARTS_MODULES, useValue: [exporting]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
