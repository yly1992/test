import { Component,ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import {} from '@types/googlemaps';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { GetweatherService } from './services/getweather.service';
import {Forecast} from "./forecast";


declare var google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit{

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public data: any;
  public icon: any;
  public name: any;
  public add: any;
  public edited :boolean= false;
  public visible :boolean= false;
  public humidity: any;
  public temperature: any;
  public summary: any;
  public forecast: Forecast[] = [];



  @ViewChild("search")
  public searchElementRef: ElementRef;

  @ViewChild("map")
  public mapElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private getweatherService: GetweatherService
  ) {}

  ngOnInit() {
    this.zoom = 8;
    this.latitude = 40.730610;
    this.longitude = -73.935242;

    this.searchControl = new FormControl();

    this.setCurrentPosition();

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

      autocomplete.addListener("place_changed", () => {
        this.edited = true;
        console.log(this.searchElementRef.nativeElement.value);

        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            alert("No available location found!");
            return;
          }

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || ''),
              (place.address_components[3] && place.address_components[3].short_name || ''),
              (place.address_components[4] && place.address_components[4].short_name || '')
            ].join(' ');
          }

          this.icon= place.icon;
          this.name= place.address_components[1] && place.address_components[1].short_name || '';
          this.add= address;

          var coords = {
            'lat' : place.geometry.location.lat(),
            'long': place.geometry.location.lng()
          };

          this.getweatherService.getWeather(coords).subscribe(data=>{
            this.data=data;
            this.visible=true;
            var jsonObj = JSON.parse(data);
            this.temperature = jsonObj.currently.temperature;
            this.summary = jsonObj.currently.summary;
            this.icon = jsonObj.currently.icon;
            this.humidity = jsonObj.currently.humidity;
            for(let i = 1; i < jsonObj.daily.data.length; i++){
              var time = new Date(jsonObj.daily.data[i].time * 1000).toDateString();

              const forecastWeather = new Forecast(address,
                                        jsonObj.daily.data[i].summary,
                                        jsonObj.daily.data[i].temperatureMin,
                                        jsonObj.daily.data[i].temperatureMax,
                                        time,
                                        jsonObj.daily.data[i].icon,
                                        jsonObj.daily.data[i].humidity
              );
              this.forecast.push(forecastWeather);
            }
          });
        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }
}
