import { Component, OnInit } from '@angular/core';
import { WellApplicationServices } from './well-application.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-root',
  providers: [WellApplicationServices],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public api_uwi: number;
  public operator_name: string;
  public lease_name: string;
  public county: string;
  public reservior: string;
  public production_type: string;
  public production_status: string;
  public drill_type: string;
  public first_prod_date: string;
  public last_prod_date: string;
  public cum_gas: number;
  public cum_oil: number;
  public cum_boe: number = 0;
  public completion_date: string;
  public spud_date: string;
  public measured_depth: string;
  public state: string;
  public lat: number;
  public long: number;
  public lati = 33.277199;
  public longi = -99.061548;
  public previous: number = -1;
  public current: number = -1;
  public isOpen = true;
  public tooltip: string;

  public firstproddate: string = "0";
  public firstsixtygas: string = "0";
  public firstsixtyoil: string = "0";
  public firsttwelvegas: string = "0";
  public firsttwelveoil: string = "0";
  public firsttwentyfourgas: string = "0";
  public firsttwentyfouroil: string = "0";
  public lasttwelvegas: string = "0";
  public lasttwelveoil: string = "0";
  public roifirsttwelve: string = "0%";
  public roifirsttwentyfour: string = "0%";
  public roifirstsixty: string = "0%";
  public roilasttwelve: string = "0%";

  public index: number = -1;

  public investment_amount = 850000;
  public nri_percentage = 0.5625;
  public gross_cash_flow_wo_expenses = 850000;

  public sold_boe = 31612;
  public production_expenses = 0;

  public average_oil_price = 0;

  public tax = 0.046;
  public tax_gas = 0.075;

  public compare_estimate;
  public temp_cum_oil;
  public ows_score: number;
  public mapurl;
  public green_count = 0;
  public yellow_count = 0;
  public textcolor;
  public color = 'red';
  public potential_profit_loss: number = 0;

  public estimated_gross_cash_flow: number = 0;
  public temp_estimated_gross_cash_flow = [];
  public oil_price = 0;
  public gas_price = 0;

  public partner_name = "LC GoOpCo Manuel #1, LP";

  public well_count: number;
  public latlong = [];
  public templatlong = [];
  public visit: number = -1;
  public currentgreencount: number = 0;
  public length: number = 0;
  public zoom: number = 11;
  public roi_percentage: number = 0;
  public slider_percentage: string = "0%";

  private map: any;
  public temp_roi_percentage;
  public map_title: string;
  public temp_roi: any = [];
  public type: string = null;
  public clicked: number = -1;
  infoWindowOpened: any = null;
  public partnership_raise = 850000;
  public partnership_term = 56.25;
  private timer;

  public startYear: number;
  public endYear: number;
  public count: number;

  // Dependency Injection
  constructor(private wellapplicationservices: WellApplicationServices) {
  }

  // Initializing the Data to Map and Panels
  ngOnInit() {
    this.timer = Observable.interval(3000);

    this.wellapplicationservices.getFiveMilesJSON().subscribe(
      JSONlat => {
        this.startYear = parseInt(JSONlat[0].year);
        this.endYear = this.startYear + 10;

        // Fetching value and storing it in Latlong Array
        for (var i = 0; i < JSONlat.length; i++) {
          this.templatlong[i] = JSONlat[i],
            error => console.log(error)
        }

        this.timer.subscribe((t) => {
          this.onTime();
        })
        this.count = JSONlat.length - 1;
        // this.calculate();
        // this.calculateows();
      }
    );

    // Calling JSON Object and Parsing Value
    /*     this.wellapplicationservices.getFiveMilesJSON().subscribe(
          JSONlat => {
    
            // Fetching value and storing it in Latlong Array
            for (var i = 0; i < JSONlat.length; i++) {
              this.latlong[i] = JSONlat[i],
                error => console.log(error)
            }
            this.well_count = JSONlat.length - 1;
            this.calculate();
            this.calculateows();
          }
        ); */
    // Initial Map Title
    this.map_title = "Overall Production Map";

    // Initialize Lower Panels
    this.hypothetical();
    this.intializeData();
  }

  //API Call
  onTime() {

    for (var i = 0; i < this.templatlong.length; i++) {
      if (this.startYear <= this.templatlong[i].year && this.endYear >= this.templatlong[i].year) {
        this.latlong[i] = this.templatlong[i];
      }
    }

    if (this.latlong.length !== this.templatlong.length)
      this.latlong.push(this.templatlong[this.templatlong.length - 1]);

    this.startYear += 10;
    this.endYear += 10;

    this.well_count = this.latlong.length - 1;
    this.calculate();
    this.calculateows();
  }

  // Tilt the Map by 45 degree 
  changeTilt(map) {
    this.map = map;
    this.map.setTilt(45);
  }

  // Get the selected Miles from the Radio Button to set the markers on Map
  getMiles(miles: string) {

    this.oil_price = 0;
    this.gas_price = 0;
    this.infoWindowOpened = null;
    this.markerarray = [];
    this.type = null;
    this.temp_roi = [];

    this.map_title = "Overall Production Map";

    // Removing the data from the Latlong Array
    /*     while (this.latlong.length > 0) {
          this.latlong.pop();
        } */

    this.latlong.length = 0;
    this.templatlong.length = 0;

    // Setting the map based on the selection of the Miles
    if (miles === "One Mile") {
      this.wellapplicationservices.getOneMileJSON().subscribe(
        JSONlat => {
          this.startYear = parseInt(JSONlat[0].year);
          this.endYear = this.startYear + 10;

          // Fetching value and storing it in Latlong Array
          for (var i = 0; i < JSONlat.length; i++) {
            this.templatlong[i] = JSONlat[i],
              error => console.log(error)
          }

          this.timer.subscribe((t) => {
            this.onTime();
          })
          this.count = JSONlat.length - 1;

          //console.log(this.latlong);

          this.firstsixtygas = "0";
          this.firstsixtyoil = "0";
          this.firsttwelvegas = "0";
          this.firsttwelveoil = "0";
          this.firsttwentyfourgas = "0";
          this.firsttwentyfouroil = "0";
          this.lasttwelvegas = "0";
          this.lasttwelveoil = "0";

          this.roifirsttwelve = "0%";
          this.roifirsttwentyfour = "0%";
          this.roifirstsixty = "0%";
          this.roilasttwelve = "0%";

          //this.well_count = JSONlat.length - 1;
          this.previous = -1;
          this.current = -1;
          this.index = -1;
          this.zoom = 14;
          this.visit = -1;
          this.clicked = -1;
          this.roi_percentage = 0;
          this.potential_profit_loss = 0;
          //this.calculate();
          //this.calculateows();
          //this.store_display(this.current);
        }
      );
    }

    else if (miles === "Three Miles") {
      this.wellapplicationservices.getThreeMilesJSON().subscribe(
        JSONlat => {
          this.startYear = parseInt(JSONlat[0].year);
          this.endYear = this.startYear + 10;

          // Fetching value and storing it in Latlong Array
          for (var i = 0; i < JSONlat.length; i++) {
            this.templatlong[i] = JSONlat[i],
              error => console.log(error)
          }

          this.timer.subscribe((t) => {
            this.onTime();
          })
          this.count = JSONlat.length - 1;
          //console.log(this.latlong);

          this.firstsixtygas = "0";
          this.firstsixtyoil = "0";
          this.firsttwelvegas = "0";
          this.firsttwelveoil = "0";
          this.firsttwentyfourgas = "0";
          this.firsttwentyfouroil = "0";
          this.lasttwelvegas = "0";
          this.lasttwelveoil = "0";

          this.roifirsttwelve = "0%";
          this.roifirsttwentyfour = "0%";
          this.roifirstsixty = "0%";
          this.roilasttwelve = "0%";

          //this.well_count = JSONlat.length - 1;
          this.previous = -1;
          this.current = -1;
          this.index = -1;
          this.zoom = 12;
          this.visit = -1;
          this.clicked = -1;
          this.roi_percentage = 0;
          this.potential_profit_loss = 0;
          //this.calculate();
          //this.calculateows();
          //this.store_display(this.current);
        }
      );
    }

    else {
      this.wellapplicationservices.getFiveMilesJSON().subscribe(
        JSONlat => {
          this.startYear = parseInt(JSONlat[0].year);
          this.endYear = this.startYear + 10;

          // Fetching value and storing it in Latlong Array
          for (var i = 0; i < JSONlat.length; i++) {
            this.templatlong[i] = JSONlat[i],
              error => console.log(error)
          }

          this.timer.subscribe((t) => {
            this.onTime();
          })
          this.count = JSONlat.length - 1;

          //console.log(this.latlong);

          this.firstsixtygas = "0";
          this.firstsixtyoil = "0";
          this.firsttwelvegas = "0";
          this.firsttwelveoil = "0";
          this.firsttwentyfourgas = "0";
          this.firsttwentyfouroil = "0";
          this.lasttwelvegas = "0";
          this.lasttwelveoil = "0";

          this.roifirsttwelve = "0%";
          this.roifirsttwentyfour = "0%";
          this.roifirstsixty = "0%";
          this.roilasttwelve = "0%";

          //this.well_count = JSONlat.length - 1;
          this.previous = -1;
          this.current = -1;
          this.index = -1;
          this.zoom = 11;
          this.visit = -1;
          this.clicked = -1;
          this.roi_percentage = 0;
          this.potential_profit_loss = 0;
          //this.calculate();
          //this.calculateows();
          //this.store_display(this.current);
        }
      );
    }
  }

  // Dynamically changing the Estimated Gross Cash Flow Value
  calculate() {
    if (this.clicked === 1) {
      this.calculateROIPercentage(this.type);
      //console.log(this.temp_roi);
    }

    this.length = this.well_count;

    let temp1 = 0, temp2 = 0;

    //Initial Calculation of ENCF
    temp1 = (this.oil_price * this.cum_oil);
    temp1 = temp1 - (this.tax * temp1);
    temp2 = (this.gas_price * this.cum_gas);
    temp2 = temp2 - (this.tax_gas * temp2);
    temp1 = temp1 + temp2;
    temp1 = temp1 - ((this.production_expenses / 100) * (temp1));
    this.estimated_gross_cash_flow = (this.partnership_term / 100) * temp1;

    this.green_count = 0;
    this.yellow_count = 0;

    // Info Window Closing and Showing
    if (this.visit != -1) {
      for (var i = 0; i < this.latlong.length; i++) {
        this.latlong[i].roi_percentage = null;
      }

      for (var i = 0; i < this.markerarray.length - 1; i++) {
        this.infoWindowOpened = this.markerarray[i];
        if (this.infoWindowOpened !== undefined && this.infoWindowOpened !== null)
          this.infoWindowOpened.close();
      }

      //this.markerarray = [];
      //this.infoWindowOpened = null;

      this.calculatepayout();

      if (this.infoWindowOpened !== null && this.infoWindowOpened !== undefined)
        this.infoWindowOpened.innerHtml = this.latlong[this.index].roi_percentage;
    }

    // Setting the Text Color of ENCF if it is greater than 1511111
    if (isNaN(this.estimated_gross_cash_flow)) {
      this.estimated_gross_cash_flow = 0;
    }

    if (this.estimated_gross_cash_flow >= this.partnership_raise) {
      this.textcolor = 'green';
    }

    else {
      this.textcolor = 'red';
    }

    for (var i = 0; i < this.length; i++) {
      // Calculation of all the well when the value of Oil or Gas is changed

      temp1 = (this.oil_price * this.latlong[i].cumoil);
      temp1 = temp1 - (this.tax * temp1);
      temp2 = (this.gas_price * this.latlong[i].cumgas);
      temp2 = temp2 - (this.tax_gas * temp2);

      this.temp_estimated_gross_cash_flow[i] = temp1 + temp2;
      this.temp_estimated_gross_cash_flow[i] = this.temp_estimated_gross_cash_flow[i] - ((this.production_expenses / 100) * (this.temp_estimated_gross_cash_flow[i]));
      this.temp_estimated_gross_cash_flow[i] = (this.partnership_term / 100) * this.temp_estimated_gross_cash_flow[i];

      this.latlong[i].grosscashflow = this.temp_estimated_gross_cash_flow[i];

      this.temp_roi_percentage = Math.floor((this.temp_estimated_gross_cash_flow[i] * 100) / this.partnership_raise);

      // Setting the Selected Marker with pointer and creating audit trail
      if (this.clicked === 1) {
        if (this.temp_roi.length > 0) {
          for (var i = 0; i < this.temp_roi.length - 1; i++) {
            if (i === this.index) {
              if (this.temp_roi[i] >= 500) {
                this.latlong[this.index].url = "assets/marker/current/green_pointer.png";
              } else if (this.temp_roi[i] >= 401 && this.temp_roi[i] <= 500) {
                this.latlong[this.index].url = "assets/marker/current/yellow_pointer.png";
              } else if (this.temp_roi[i] >= 301 && this.temp_roi[i] <= 400) {
                this.latlong[this.index].url = "assets/marker/current/orange_pointer.png";
              } else if (this.temp_roi[i] >= 201 && this.temp_roi[i] <= 300) {
                this.latlong[this.index].url = "assets/marker/current/red_pointer.png";
              } else if (this.temp_roi[i] >= 101 && this.temp_roi[i] <= 200) {
                this.latlong[this.index].url = "assets/marker/current/marron_pointer.png";
              } else {
                this.latlong[this.index].url = "assets/marker/current/blue_pointer.png";
              }
            }

            else {
              if (this.temp_roi[i] >= 500) {
                this.latlong[i].url = "assets/marker/plain/green.png";
              } else if (this.temp_roi[i] >= 401 && this.temp_roi[i] <= 500) {
                this.latlong[i].url = "assets/marker/plain/yellow.png";
              } else if (this.temp_roi[i] >= 301 && this.temp_roi[i] <= 400) {
                this.latlong[i].url = "assets/marker/plain/orange.png";
              } else if (this.temp_roi[i] >= 201 && this.temp_roi[i] <= 300) {
                this.latlong[i].url = "assets/marker/plain/red.png";
              } else if (this.temp_roi[i] >= 101 && this.temp_roi[i] <= 200) {
                this.latlong[i].url = "assets/marker/plain/marron.png";
              } else {
                this.latlong[i].url = "assets/marker/plain/blue.png";
              }
            }
          }
        }
      }


      else {
        if (this.temp_estimated_gross_cash_flow[i] >= this.partnership_raise) {
          this.green_count = this.green_count + 1;
          //this.latlong[i].url = "assets/img/green_marker.png";

          if (i === this.index) {
            if (this.temp_roi_percentage >= 500) {
              this.latlong[this.index].url = "assets/marker/current/green_pointer.png";
            } else if (this.temp_roi_percentage >= 401 && this.temp_roi_percentage <= 500) {
              this.latlong[this.index].url = "assets/marker/current/yellow_pointer.png";
            } else if (this.temp_roi_percentage >= 301 && this.temp_roi_percentage <= 400) {
              this.latlong[this.index].url = "assets/marker/current/orange_pointer.png";
            } else if (this.temp_roi_percentage >= 201 && this.temp_roi_percentage <= 300) {
              this.latlong[this.index].url = "assets/marker/current/red_pointer.png";
            } else if (this.temp_roi_percentage >= 101 && this.temp_roi_percentage <= 200) {
              this.latlong[this.index].url = "assets/marker/current/marron_pointer.png";
            } else {
              this.latlong[this.index].url = "assets/marker/current/blue_pointer.png";
            }
          }

          else {
            if (this.temp_roi_percentage >= 500) {
              this.latlong[i].url = "assets/marker/plain/green.png";
            } else if (this.temp_roi_percentage >= 401 && this.temp_roi_percentage <= 500) {
              this.latlong[i].url = "assets/marker/plain/yellow.png";
            } else if (this.temp_roi_percentage >= 301 && this.temp_roi_percentage <= 400) {
              this.latlong[i].url = "assets/marker/plain/orange.png";
            } else if (this.temp_roi_percentage >= 201 && this.temp_roi_percentage <= 300) {
              this.latlong[i].url = "assets/marker/plain/red.png";
            } else if (this.temp_roi_percentage >= 101 && this.temp_roi_percentage <= 200) {
              this.latlong[i].url = "assets/marker/plain/marron.png";
            } else {
              this.latlong[i].url = "assets/marker/plain/blue.png";
            }
          }
        }

        else {
          this.yellow_count = this.yellow_count + 1;
          //this.latlong[i].url = "assets/grey_marker.png";

          if (i === this.index) {
            if (this.temp_roi_percentage >= 500) {
              this.latlong[this.index].url = "assets/marker/current/green_pointer.png";
            } else if (this.temp_roi_percentage >= 401 && this.temp_roi_percentage <= 500) {
              this.latlong[this.index].url = "assets/marker/current/yellow_pointer.png";
            } else if (this.temp_roi_percentage >= 301 && this.temp_roi_percentage <= 400) {
              this.latlong[this.index].url = "assets/marker/current/orange_pointer.png";
            } else if (this.temp_roi_percentage >= 201 && this.temp_roi_percentage <= 300) {
              this.latlong[this.index].url = "assets/marker/current/red_pointer.png";
            } else if (this.temp_roi_percentage >= 101 && this.temp_roi_percentage <= 200) {
              this.latlong[this.index].url = "assets/marker/current/marron_pointer.png";
            } else {
              this.latlong[this.index].url = "assets/marker/current/blue_pointer.png";
            }
          }

          else {
            if (this.temp_roi_percentage >= 500) {
              this.latlong[i].url = "assets/marker/plain/green.png";
            } else if (this.temp_roi_percentage >= 401 && this.temp_roi_percentage <= 500) {
              this.latlong[i].url = "assets/marker/plain/yellow.png";
            } else if (this.temp_roi_percentage >= 301 && this.temp_roi_percentage <= 400) {
              this.latlong[i].url = "assets/marker/plain/orange.png";
            } else if (this.temp_roi_percentage >= 201 && this.temp_roi_percentage <= 300) {
              this.latlong[i].url = "assets/marker/plain/red.png";
            } else if (this.temp_roi_percentage >= 101 && this.temp_roi_percentage <= 200) {
              this.latlong[i].url = "assets/marker/plain/marron.png";
            } else {
              this.latlong[i].url = "assets/marker/plain/blue.png";
            }
          }
        }
      }
    }

    this.calculateows();
    //this.getTooltip();
  }

  // Setting Markers based on Production Selected
  onProductionClick(type) {
    this.oil_price = 0;
    this.gas_price = 0;
    this.previous = -1;
    this.current = -1;
    this.index = -1;
    this.type = type;
    this.clicked = 1;
    this.roi_percentage = 0;

    if (this.visit === 1) {
      for (var i = 0; i < this.latlong.length; i++) {
        this.latlong[i].roi_percentage = null;
      }

      for (var i = 0; i < this.markerarray.length; i++) {
        this.infoWindowOpened = this.markerarray[i];
        this.infoWindowOpened.close();
      }

      this.markerarray = [];
      this.infoWindowOpened = null;
    }

    this.visit = -1;
    this.store_display(this.current);
    this.calculateROIPercentage(type);
  }

  // Calculate
  calculateROIPercentage(type) {
    var temp: any = [];
    if (type === 'first12') {
      temp = [];
      this.map_title = "First 12 Months Production Map"

      this.latlong.forEach(element => {
        temp.push(this.calculateROI(element.firsttwelveoil, element.firsttwelvegas));
      });
    }

    else if (type === 'first24') {
      temp = [];
      this.map_title = "First 24 Months Production Map"

      this.latlong.forEach(element => {
        temp.push(this.calculateROI(element.firsttwentyfouroil, element.firsttwentyfourgas));
      });
    }

    else if (type === 'first60') {
      temp = [];
      this.map_title = "First 60 Months Production Map";

      this.latlong.forEach(element => {
        temp.push(this.calculateROI(element.firstsixtyoil, element.firstsixtygas));
      });
    }

    else if (type === 'last12') {
      temp = [];
      this.map_title = "Last 12 Months Production Map";

      this.latlong.forEach(element => {
        temp.push(this.calculateROI(element.lasttwelveoil, element.lasttwelvegas));
      });
    }

    if (temp.length > 0) {
      for (var i = 0; i < temp.length - 1; i++) {
        if (temp[i] >= 500) {
          this.latlong[i].url = "assets/marker/plain/green.png";
        } else if (temp[i] >= 401 && temp[i] <= 500) {
          this.latlong[i].url = "assets/marker/plain/yellow.png";
        } else if (temp[i] >= 301 && temp[i] <= 400) {
          this.latlong[i].url = "assets/marker/plain/orange.png";
        } else if (temp[i] >= 201 && temp[i] <= 300) {
          this.latlong[i].url = "assets/marker/plain/red.png";
        } else if (temp[i] >= 101 && temp[i] <= 200) {
          this.latlong[i].url = "assets/marker/plain/marron.png";
        } else {
          this.latlong[i].url = "assets/marker/plain/blue.png";
        }
      }

      this.temp_roi = temp;
    }
  }

  // Setting the lower Slider Div value to selected marker ENCF
  getTooltip() {
    document.getElementById("tooltipText").style.display = 'inline-block';

    if (this.green_count - 1 != -1) {
      this.tooltip = this.latlong[this.green_count - 1].grosscashflow;
      this.slider_percentage = Math.floor((this.green_count / this.well_count) * 100) - 6 + "%";
    }

    else {
      this.tooltip = "0";
      this.slider_percentage = "0%";
    }
  }

  // Dynamically Calculating the Payout Value and setting the text color to Green or Red
  calculatepayout() {
    this.potential_profit_loss = this.estimated_gross_cash_flow - this.partnership_raise;

    if (this.potential_profit_loss < 0) {
      this.color = 'red';
      if (isNaN(this.potential_profit_loss)) {
        this.potential_profit_loss = 0;
      }
      else {
        this.potential_profit_loss = Math.abs(this.potential_profit_loss);
      }
    }

    else {
      this.color = 'green';
    }

    //this.roi_percentage = (Math.floor((this.estimated_gross_cash_flow * 100) / this.partnership_raise)).toString() + "%";

    this.roi_percentage = (Math.floor((this.estimated_gross_cash_flow * 100) / this.partnership_raise));

    this.latlong[this.current].roi_percentage = this.temp_roi[this.current] >= 0 ? this.temp_roi[this.current] : this.roi_percentage;

    this.roifirsttwelve = this.calculateROI(this.firsttwelveoil, this.firsttwelvegas) + "%";
    this.roifirsttwentyfour = this.calculateROI(this.firsttwentyfouroil, this.firsttwentyfourgas) + "%";
    this.roifirstsixty = this.calculateROI(this.firstsixtyoil, this.firstsixtygas) + "%";
    this.roilasttwelve = this.calculateROI(this.lasttwelveoil, this.lasttwelvegas) + "%";
  }

  // Calculate Table ROI Value
  calculateROI(oil, gas) {
    let temp1, temp2, tempflow;

    temp1 = (this.oil_price * oil);
    temp1 = temp1 - (this.tax * temp1); //848726.1
    temp2 = (this.gas_price * gas);
    temp2 = temp2 - (this.tax_gas * temp2); //0
    temp1 = temp1 + temp2; //848726.1
    temp1 = temp1 - ((this.production_expenses / 100) * (temp1)); //848726.1
    tempflow = (this.partnership_term / 100) * temp1; //477408.43

    return (Math.floor((tempflow * 100) / this.partnership_raise));
  }

  // Dynamically changing and calculating OWS Score
  calculateows() {
    this.ows_score = 0;
    this.green_count = 0;
    this.yellow_count = 0;

    for (var i = 0; i < this.length; i++) {
      if (this.latlong[i].grosscashflow >= this.partnership_raise) {
        this.green_count = this.green_count + 1;
      }

      else {
        this.yellow_count = this.yellow_count + 1;
      }

      // Addition of ENCF
      this.ows_score = this.ows_score + this.latlong[i].grosscashflow;
    }

    // Calculating the Average and OWS Score
    this.ows_score = Math.round((this.ows_score * 100) / (this.well_count * this.partnership_raise));
  }

  markerarray: string[] = [];
  // Getting Latitude and Longitude Value of the clicked marker
  onMarkerClickLocation(pos: number, infoRef) {

    var tempmarkerarray: any = [];
    tempmarkerarray = this.markerarray;

    // Removing the repeated markers from the array
    for (var i = 0; i < this.markerarray.length; i++) {
      if (tempmarkerarray[i]._id === infoRef._id) {
        this.markerarray.splice(i, 1);
      }
    }

    this.markerarray.push(infoRef);

    if (this.visit !== 1 && this.type !== null) {
      this.calculateROIPercentage(this.type);
    }

    this.visit = 1;

    if (this.previous != -1) {
      this.previous = this.current;
    }

    if (pos != this.length) {
      // Setting the clicked marker to Pink Blur and Previous marker to Green Pink or Grey Pink
      this.current = pos;

      // Creating the trail of Wells
      if (pos != this.previous) {

        this.calculatepayout();

        // Setting the current well to Pin Blur
        if (this.latlong[pos].url == "assets/marker/plain/green.png" || this.latlong[pos].url == "assets/marker/previous/green_border.png" || this.latlong[pos].url == "assets/marker/current/green_pointer.png") {
          this.latlong[pos].url = "assets/marker/current/green_pointer.png";
        } else if (this.latlong[pos].url == "assets/marker/plain/yellow.png" || this.latlong[pos].url == "assets/marker/previous/yellow_border.png" || this.latlong[pos].url == "assets/marker/current/yellow_pointer.png") {
          this.latlong[pos].url = "assets/marker/current/yellow_pointer.png";
        } else if (this.latlong[pos].url == "assets/marker/plain/orange.png" || this.latlong[pos].url == "assets/marker/previous/orange_border.png" || this.latlong[pos].url == "assets/marker/current/orange_pointer.png") {
          this.latlong[pos].url = "assets/marker/current/orange_pointer.png";
        } else if (this.latlong[pos].url == "assets/marker/plain/red.png" || this.latlong[pos].url == "assets/marker/previous/red_border.png" || this.latlong[pos].url == "assets/marker/current/red_pointer.png") {
          this.latlong[pos].url = "assets/marker/current/red_pointer.png";
        } else if (this.latlong[pos].url == "assets/marker/plain/marron.png" || this.latlong[pos].url == "assets/marker/previous/marron_border.png" || this.latlong[pos].url == "assets/marker/current/marron_pointer.png") {
          this.latlong[pos].url = "assets/marker/current/marron_pointer.png";
        } else if (this.latlong[pos].url == "assets/marker/plain/blue.png" || this.latlong[pos].url == "assets/marker/previous/blue_border.png" || this.latlong[pos].url == "assets/marker/current/blue_pointer.png") {
          this.latlong[pos].url = "assets/marker/current/blue_pointer.png";
        }

        if (this.previous != -1) {
          if (this.temp_roi.length > 0) {
            if (this.temp_estimated_gross_cash_flow[this.previous] >= this.partnership_raise) {
              //this.latlong[this.previous].url = "assets/green_yellow.png";

              if (this.temp_roi[this.previous] >= 500) {
                this.latlong[this.previous].url = "assets/marker/previous/green_border.png";
              } else if (this.temp_roi[this.previous] >= 401 && this.temp_roi[this.previous] <= 500) {
                this.latlong[this.previous].url = "assets/marker/previous/yellow_border.png";
              } else if (this.temp_roi[this.previous] >= 301 && this.temp_roi[this.previous] <= 400) {
                this.latlong[this.previous].url = "assets/marker/previous/orange_border.png";
              } else if (this.temp_roi[this.previous] >= 201 && this.temp_roi[this.previous] <= 300) {
                this.latlong[this.previous].url = "assets/marker/previous/red_border.png";
              } else if (this.temp_roi[this.previous] >= 101 && this.temp_roi[this.previous] <= 200) {
                this.latlong[this.previous].url = "assets/marker/previous/marron_border.png";
              } else {
                this.latlong[this.previous].url = "assets/marker/previous/blue_border.png";
              }

            }
            else {
              //this.latlong[this.previous].url = "assets/grey_yellow.png";

              if (this.temp_roi[this.previous] >= 500) {
                this.latlong[this.previous].url = "assets/marker/previous/green_border.png";
              } else if (this.temp_roi[this.previous] >= 401 && this.temp_roi[this.previous] <= 500) {
                this.latlong[this.previous].url = "assets/marker/previous/yellow_border.png";
              } else if (this.temp_roi[this.previous] >= 301 && this.temp_roi[this.previous] <= 400) {
                this.latlong[this.previous].url = "assets/marker/previous/orange_border.png";
              } else if (this.temp_roi[this.previous] >= 201 && this.temp_roi[this.previous] <= 300) {
                this.latlong[this.previous].url = "assets/marker/previous/red_border.png";
              } else if (this.temp_roi[this.previous] >= 101 && this.temp_roi[this.previous] <= 200) {
                this.latlong[this.previous].url = "assets/marker/previous/marron_border.png";
              } else {
                this.latlong[this.previous].url = "assets/marker/previous/blue_border.png";
              }
            }
          }

          else {
            if (this.temp_estimated_gross_cash_flow[this.previous] >= this.partnership_raise) {
              //this.latlong[this.previous].url = "assets/green_yellow.png";

              if (this.roi_percentage >= 500) {
                this.latlong[this.previous].url = "assets/marker/previous/green_border.png";
              } else if (this.roi_percentage >= 401 && this.roi_percentage <= 500) {
                this.latlong[this.previous].url = "assets/marker/previous/yellow_border.png";
              } else if (this.roi_percentage >= 301 && this.roi_percentage <= 400) {
                this.latlong[this.previous].url = "assets/marker/previous/orange_border.png";
              } else if (this.roi_percentage >= 201 && this.roi_percentage <= 300) {
                this.latlong[this.previous].url = "assets/marker/previous/red_border.png";
              } else if (this.roi_percentage >= 101 && this.roi_percentage <= 200) {
                this.latlong[this.previous].url = "assets/marker/previous/marron_border.png";
              } else {
                this.latlong[this.previous].url = "assets/marker/previous/blue_border.png";
              }

            }
            else {
              //this.latlong[this.previous].url = "assets/grey_yellow.png";
              if (this.roi_percentage >= 500) {
                this.latlong[this.previous].url = "assets/marker/previous/green_border.png";
              } else if (this.roi_percentage >= 401 && this.roi_percentage <= 500) {
                this.latlong[this.previous].url = "assets/marker/previous/yellow_border.png";
              } else if (this.roi_percentage >= 301 && this.roi_percentage <= 400) {
                this.latlong[this.previous].url = "assets/marker/previous/orange_border.png";
              } else if (this.roi_percentage >= 201 && this.roi_percentage <= 300) {
                this.latlong[this.previous].url = "assets/marker/previous/red_border.png";
              } else if (this.roi_percentage >= 101 && this.roi_percentage <= 200) {
                this.latlong[this.previous].url = "assets/marker/previous/marron_border.png";
              } else {
                this.latlong[this.previous].url = "assets/marker/previous/blue_border.png";
              }
            }
          }
        }

        else {
          this.previous = pos;
        }
      }

      this.index = pos;

      this.store_display(this.current);
    }
  }

  // Setting & Getting Slider value 
  myOnFinish(event) {
    /*
        if (event.from - 1 == -1) {
          this.oil_price = 0;
          this.gas_price = 0;
        }
    
        else {
          if (this.oil_price == 0 && this.gas_price == 0) {
            this.oil_price = 60;
            this.gas_price = 3;
          }
        }
    
        if (event.from - 1 != -1) {
          this.calculate();
          this.calculateows();
          this.calculatepayout();
          this.green_count = event.from;
          this.getTooltip();
          this.visit = 1;
          this.store_display(event.from - 1);
    
          this.getMarker(event.from - 1);
        }
    
        else {
          this.calculate();
          this.calculateows();
          this.color = 'red';
          this.potential_profit_loss = 0;
          this.roi_percentage = 0;
          this.green_count = 0;
          this.getTooltip();
        }
    */

  }

  // Get the Selected Slider Marker
  getMarker(position: number) {

    if (this.index != -1) {
      if (this.latlong[this.index].grosscashflow >= this.partnership_raise) {
        //this.latlong[this.index].url = "assets/green.png";

        if (this.temp_roi_percentage >= 500) {
          this.latlong[this.index].url = "assets/marker/plain/green.png";
        } else if (this.temp_roi_percentage >= 401 && this.temp_roi_percentage <= 500) {
          this.latlong[this.index].url = "assets/marker/plain/yellow.png";
        } else if (this.temp_roi_percentage >= 301 && this.temp_roi_percentage <= 400) {
          this.latlong[this.index].url = "assets/marker/plain/orange.png";
        } else if (this.temp_roi_percentage >= 201 && this.temp_roi_percentage <= 300) {
          this.latlong[this.index].url = "assets/marker/plain/red.png";
        } else if (this.temp_roi_percentage >= 101 && this.temp_roi_percentage <= 200) {
          this.latlong[this.index].url = "assets/marker/plain/marron.png";
        } else {
          this.latlong[this.index].url = "assets/marker/plain/blue.png";
        }
      }

      else {
        //this.latlong[this.index].url = "assets/grey.png";

        if (this.temp_roi_percentage >= 500) {
          this.latlong[this.index].url = "assets/marker/plain/green.png";
        } else if (this.temp_roi_percentage >= 401 && this.temp_roi_percentage <= 500) {
          this.latlong[this.index].url = "assets/marker/plain/yellow.png";
        } else if (this.temp_roi_percentage >= 301 && this.temp_roi_percentage <= 400) {
          this.latlong[this.index].url = "assets/marker/plain/orange.png";
        } else if (this.temp_roi_percentage >= 201 && this.temp_roi_percentage <= 300) {
          this.latlong[this.index].url = "assets/marker/plain/red.png";
        } else if (this.temp_roi_percentage >= 101 && this.temp_roi_percentage <= 200) {
          this.latlong[this.index].url = "assets/marker/plain/marron.png";
        } else {
          this.latlong[this.index].url = "assets/marker/plain/blue.png";
        }
      }
    }

    if (position != -1) {
      if (this.latlong[position].grosscashflow >= this.partnership_raise) {
        //this.latlong[position].url = "assets/green_blur.png";

        if (this.temp_roi_percentage >= 500) {
          this.latlong[this.index].url = "assets/marker/current/green_pointer.png";
        } else if (this.temp_roi_percentage >= 401 && this.temp_roi_percentage <= 500) {
          this.latlong[this.index].url = "assets/marker/current/yellow_pointer.png";
        } else if (this.temp_roi_percentage >= 301 && this.temp_roi_percentage <= 400) {
          this.latlong[this.index].url = "assets/marker/current/orange_pointer.png";
        } else if (this.temp_roi_percentage >= 201 && this.temp_roi_percentage <= 300) {
          this.latlong[this.index].url = "assets/marker/current/red_pointer.png";
        } else if (this.temp_roi_percentage >= 101 && this.temp_roi_percentage <= 200) {
          this.latlong[this.index].url = "assets/marker/current/marron_pointer.png";
        } else {
          this.latlong[this.index].url = "assets/marker/current/blue_pointer.png";
        }
      }

      else {
        //this.latlong[position].url = "assets/grey_blur.png";

        if (this.temp_roi_percentage >= 500) {
          this.latlong[this.index].url = "assets/marker/current/green_pointer.png";
        } else if (this.temp_roi_percentage >= 401 && this.temp_roi_percentage <= 500) {
          this.latlong[this.index].url = "assets/marker/current/yellow_pointer.png";
        } else if (this.temp_roi_percentage >= 301 && this.temp_roi_percentage <= 400) {
          this.latlong[this.index].url = "assets/marker/current/orange_pointer.png";
        } else if (this.temp_roi_percentage >= 201 && this.temp_roi_percentage <= 300) {
          this.latlong[this.index].url = "assets/marker/current/red_pointer.png";
        } else if (this.temp_roi_percentage >= 101 && this.temp_roi_percentage <= 200) {
          this.latlong[this.index].url = "assets/marker/current/marron_pointer.png";
        } else {
          this.latlong[this.index].url = "assets/marker/current/blue_pointer.png";
        }
      }

      this.previous = this.index;
      this.index = position;
      this.current = position;
    }
  }

  // Displaying the details of the selected marker 
  store_display(position: number) {
    if (position != -1) {
      this.api_uwi = this.latlong[position].apiuwi;
      this.operator_name = this.latlong[position].operatorname;
      this.lease_name = this.latlong[position].leasename;
      this.county = this.latlong[position].county;
      this.reservior = this.latlong[position].reservior;
      this.production_status = this.latlong[position].productionstatus;
      this.drill_type = this.latlong[position].drilltype;
      this.first_prod_date = this.latlong[position].firstproddate;
      this.last_prod_date = this.latlong[position].lastproddate;
      this.cum_gas = this.latlong[position].cumgas;
      this.cum_oil = this.latlong[position].cumoil;
      this.measured_depth = this.latlong[position].measureddepth;
      this.state = this.latlong[position].state;
      this.lat = this.latlong[position].latitude;
      this.long = this.latlong[position].longitude;
      this.estimated_gross_cash_flow = this.latlong[position].grosscashflow;

      // Table ROI Calculation
      this.firstsixtygas = this.latlong[position].firstsixtygas;
      this.firstsixtyoil = this.latlong[position].firstsixtyoil;
      this.firsttwelvegas = this.latlong[position].firsttwelvegas;
      this.firsttwelveoil = this.latlong[position].firsttwelveoil;
      this.firsttwentyfourgas = this.latlong[position].firsttwentyfourgas;
      this.firsttwentyfouroil = this.latlong[position].firsttwentyfouroil;
      this.lasttwelvegas = this.latlong[position].lasttwelvegas;
      this.lasttwelveoil = this.latlong[position].lasttwelveoil;

      //console.log(this.latlong[position]);

      this.calculatepayout();

      if (this.estimated_gross_cash_flow >= this.partnership_raise) {
        this.textcolor = 'green';
      }

      else {
        this.textcolor = 'red';
      }

    }

    else {
      this.api_uwi = null;
      this.operator_name = "";
      this.lease_name = "";
      this.county = "";
      this.reservior = "";
      this.production_status = "";
      this.drill_type = "";
      this.first_prod_date = "";
      this.last_prod_date = "";
      this.cum_gas = null;
      this.cum_oil = null;
      this.measured_depth = "";
      this.state = "";
      this.lat = null;
      this.long = null;
      this.estimated_gross_cash_flow = 0;
      this.potential_profit_loss = 0;

      this.firstsixtygas = "";
      this.firstsixtyoil = "";
      this.firsttwelvegas = "";
      this.firsttwelveoil = "";
      this.firsttwentyfourgas = "";
      this.firsttwentyfouroil = "";
      this.lasttwelvegas = "";
      this.lasttwelveoil = "";

      this.textcolor = 'red';
    }
  }

  // Setting the Lower Slider Div invisible 
  myOnChange() {
    document.getElementById("tooltipText").style.display = 'none';
  }

  // Reload Page
  onReload() {
    window.location.reload();
  }

  /*-------------------------------------------------------------------------------------------------------------------*/

  // Hypothetical Price, Production, and Cash Flow Scenarios section calculation
  public unit_price: number = 1700000;
  public c: number = 0.1125;
  public Hypothetical_investment_model: number = 0;
  public Estimated_oil_model: number = 0;
  public Estimated_gas_model: number = 0;
  public Estimated_oil_price_model: number = 0;
  public Estimated_gas_price_model: number = 0;
  public Estimated_Oil_ultimate_recovery_model = 0;
  public Estimated_Gas_ultimate_recovery_model = 0;
  public Projected_Lifespan: number = 0;
  public Net_Income_Difference: number = 0;
  public Actual_Dollars_At_Risk: number = 0;
  public unit_equivalent_model: number = 0;
  public Net_Revenue_model: number = 0;
  public five_percent_of_temp: number = 0;
  public Potential_Monthly_model: number = 0;
  public Months_to_model: number = 0;
  public Total_Potential_model: number = 0;

  public Operating_Expenses_Ratio = 0;
  public Months_to_cash_flow: number;
  public roi_percent: string = "0%";

  public unit: string;

  // Calculate Hypothetical Price, Production, and Cash Flow Scenarios
  hypothetical() {
    let temp1 = 0, temp2 = 0;

    // Unit Equivalent Model Calculation
    this.unit_equivalent_model = (this.Hypothetical_investment_model / this.unit_price) * 10;
    this.findFraction(this.unit_equivalent_model);

    // NRI Percentage Calculation
    this.Net_Revenue_model = this.c * this.unit_equivalent_model;
    this.Net_Revenue_model = parseFloat(this.Net_Revenue_model.toPrecision(4));

    // Estimated Monthly Income Calculation
    temp1 = this.Estimated_oil_model * 30 * this.Estimated_oil_price_model;
    temp1 = temp1 - (this.tax * temp1);
    temp2 = this.Estimated_gas_model * 30 * this.Estimated_gas_price_model;
    temp2 = (temp2 - (this.tax_gas * temp2)) * this.Net_Revenue_model;
    temp1 = temp1 + temp2;
    temp1 = temp1 - ((this.Operating_Expenses_Ratio / 100) * temp1);
    this.Potential_Monthly_model = temp1 * this.Net_Revenue_model;
    this.Potential_Monthly_model = parseFloat(this.Potential_Monthly_model.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);

    temp1 = this.Estimated_Oil_ultimate_recovery_model * this.Estimated_oil_price_model;
    temp1 = temp1 - (this.tax * temp1);
    temp2 = this.Estimated_Gas_ultimate_recovery_model * this.Estimated_gas_price_model
    temp2 = temp2 - (this.tax_gas * temp2);
    temp1 = (temp1 + temp2) * this.Net_Revenue_model;
    this.Total_Potential_model = temp1 - ((this.Operating_Expenses_Ratio / 100) * temp1);

    // Months to Payout Calculation
    if (isFinite(this.Hypothetical_investment_model / this.Potential_Monthly_model) && !isNaN(this.Hypothetical_investment_model / this.Potential_Monthly_model))
      this.Months_to_model = this.Hypothetical_investment_model / this.Potential_Monthly_model;

    else
      this.Months_to_model = 0;

    // Estimated Months of Cash Flow

    if (isFinite(this.Total_Potential_model / this.Potential_Monthly_model) && !isNaN(this.Total_Potential_model / this.Potential_Monthly_model))
      this.Months_to_cash_flow = this.Total_Potential_model / this.Potential_Monthly_model;

    else
      this.Months_to_cash_flow = 0;

    if (isFinite(Math.floor((this.Total_Potential_model * 100) / this.Hypothetical_investment_model)) && !isNaN(Math.floor((this.Total_Potential_model * 100) / this.Hypothetical_investment_model)))
      this.roi_percent = (Math.floor((this.Total_Potential_model * 100) / this.Hypothetical_investment_model)).toString() + "%";
    else
      this.roi_percent = "0%";
  }

  // Converting the Decimal to Fraction Part
  findFraction(value: number) {
    let numerator: string = value.toFixed(2).toString();
    let extra = numerator.split('.');

    if (100 % extra["1"] == 0) {
      extra["0"] = 100 / extra["1"];
      extra["1"] = extra["1"] / extra["1"];
    }

    else {
      let temp = extra["1"];

      if (temp % (Math.floor(temp / 2)) == 0 && 100 % (Math.floor(temp / 2)) == 0) {
        extra["1"] = temp / Math.floor(temp / 2);
        extra["0"] = 100 / Math.floor(temp / 2);
      }

      else if (temp % 20 == 0 && 100 % 20 == 0) {
        extra["1"] = temp / 20;
        extra["0"] = 100 / 20;
      }

      else if (temp % 10 == 0 && 100 % 10 == 0) {
        extra["1"] = temp / 10;
        extra["0"] = 100 / 10;
      }

      else if (temp % 5 == 0 && 100 % 5 == 0) {
        extra["1"] = temp / 5;
        extra["0"] = 100 / 5;
      }

      else if (temp % 4 == 0 && 100 % 4 == 0) {
        extra["1"] = temp / 4;
        extra["0"] = 100 / 4;
      }

      else if (temp % 2 == 0 && 100 % 2 == 0) {
        extra["1"] = temp / 2;
        extra["0"] = 100 / 2;
      }

      else {
        extra["1"] = extra["1"];
        extra["0"] = 100;
      }
    }

    if (extra["1"] != 0 && (!isNaN(extra["1"]) || isFinite(extra["0"]))) {
      if (Math.floor(value) != 0) {
        if ((extra["1"] && extra["0"]) == 1) {
          this.unit = Math.floor(value) + extra["1"];
        }
        else {
          this.unit = Math.floor(value) + " " + extra["1"] + "/" + extra["0"];
        }
      }
      else {
        this.unit = extra["1"] + "/" + extra["0"];
      }
    }
    else {
      this.unit = Math.floor(this.unit_equivalent_model).toString();
    }
  }

  // 2016 K-1 Tax Estimator section calculation
  public Estimated_Taxable_Income_model: number = 500000;
  public Investment_Amount_K1_model: number = 0;
  public Filing_Status: number = -1;
  public data = [];

  public Tax_Bracket: number = 0;
  public Tax_Bracket_K1: number = 0;
  public Estimated_Tax_Due: number = 0;
  public Deduction_K1: number = 0;
  public Adjusted_Taxable_Income: number = 0;
  public Adjusted_Taxable_Income_K1: number = 0;

  public After_Tax_Income: number = 0;
  public After_Tax_Income_K1: number = 0;

  public Tax_Rate_Pay_Tax: number = 0;
  public Tax_Rate_Pay_Tax_K1: number = 0;

  public Range_Start: number = 0;
  public Excess_Income: number = 0;
  public Excess_Income_K1: number = 0;
  public Tax_On_Excess: number = 0;
  public Tax_On_Excess_K1: number = 0;
  public Estimated_Tax_Due_K1: number = 0;
  public Adjusted_Net_Income: number = 0;
  public Adjusted_Net_Income_K1: number = 0;
  public Tax_Savings_K1: number = 0;
  public Tax_Liability: number = 0;
  public Tax_Liability_K1: number = 0;
  public Partnership_Investment: number = 0;
  public Income_Difference: number = 0;
  public k1_deduction_percentage: number = 75;
  public panel_visit: number = 0;

  // Initialize the data[]
  intializeData() {
    this.data[0] = [{
      "range_start": 191650,
      "range_end": 416700,
      "percent_on_excess_k1": 33.0,
      "percent_on_excess": 33.0,
      "tax_rate_pay_tax_k1": 46643.75,
      "tax_rate_pay_tax": 46643.75
    },
    {
      "range_start": 416700,
      "range_end": 418400,
      "percent_on_excess_k1": 35.0,
      "percent_on_excess": 35.0,
      "tax_rate_pay_tax_k1": 120910.25,
      "tax_rate_pay_tax": 120910.25
    },
    {
      "range_start": 418400,
      "range_end": "Infinity",
      "percent_on_excess_k1": 39.6,
      "percent_on_excess": 39.6,
      "tax_rate_pay_tax_k1": 121505.25,
      "tax_rate_pay_tax": 121505.25
    }
    ];

    this.data[1] = [{
      "range_start": 153100,
      "range_end": 233350,
      "percent_on_excess_k1": 28,
      "percent_on_excess": 28,
      "tax_rate_pay_tax_k1": 29752.5,
      "tax_rate_pay_tax": 29752.5
    },
    {
      "range_start": 233350,
      "range_end": 416700,
      "percent_on_excess_k1": 33,
      "percent_on_excess": 33,
      "tax_rate_pay_tax_k1": 52222.5,
      "tax_rate_pay_tax": 52222.5
    },
    {
      "range_start": 416700,
      "range_end": 470700,
      "percent_on_excess_k1": 35,
      "percent_on_excess": 35,
      "tax_rate_pay_tax_k1": 112728,
      "tax_rate_pay_tax": 112728
    },
    {
      "range_start": 470700,
      "range_end": "Infinity",
      "percent_on_excess_k1": 39.6,
      "percent_on_excess": 39.6,
      "tax_rate_pay_tax_k1": 131628,
      "tax_rate_pay_tax": 131628
    }
    ];

    this.data[2] = [{
      "range_start": 116675,
      "range_end": 208350,
      "percent_on_excess_k1": 33,
      "percent_on_excess": 28,
      "tax_rate_pay_tax_k1": 26111.25,
      "tax_rate_pay_tax": 26111.25
    },
    {
      "range_start": 208350,
      "range_end": 235350,
      "percent_on_excess_k1": 35,
      "percent_on_excess": 33,
      "tax_rate_pay_tax_k1": 56364,
      "tax_rate_pay_tax": 56364
    },
    {
      "range_start": 235350,
      "range_end": "Infinity",
      "percent_on_excess_k1": 39.6,
      "percent_on_excess": 35,
      "tax_rate_pay_tax_k1": 65814,
      "tax_rate_pay_tax": 65814
    }
    ];

    this.data[3] = [{
      "range_start": 212500,
      "range_end": 416700,
      "percent_on_excess_k1": 33,
      "percent_on_excess": 28,
      "tax_rate_pay_tax_k1": 49816,
      "tax_rate_pay_tax": 26111.25
    },
    {
      "range_start": 416700,
      "range_end": 444550,
      "percent_on_excess_k1": 35,
      "percent_on_excess": 33,
      "tax_rate_pay_tax_k1": 117202.5,
      "tax_rate_pay_tax": 117202.5
    },
    {
      "range_start": 444550,
      "range_end": "Infinity",
      "percent_on_excess_k1": 39.6,
      "percent_on_excess": 35,
      "tax_rate_pay_tax_k1": 126950,
      "tax_rate_pay_tax": 126950
    }
    ];
  }

  // Get the selected value from the dropdown list
  getSelected(selectedValue: string) {
    this.Filing_Status = parseInt(selectedValue);
  }

  // Calculate the K1 with and without K1 value 
  compare_k1() {
    this.Deduction_K1 = this.Investment_Amount_K1_model * 0.75;
    this.Adjusted_Taxable_Income = this.Estimated_Taxable_Income_model;
    this.Adjusted_Taxable_Income_K1 = this.Estimated_Taxable_Income_model - this.Deduction_K1;

    for (var i = 0; i < this.data[this.Filing_Status].length; i++) {
      if (this.data[this.Filing_Status][i].range_start <= this.Adjusted_Taxable_Income && this.Adjusted_Taxable_Income <= this.data[this.Filing_Status][i].range_end) {
        this.panel_visit = 1;

        this.Tax_Bracket = this.data[this.Filing_Status][i].percent_on_excess / 100;
        this.Tax_Bracket_K1 = this.data[this.Filing_Status][i].percent_on_excess_k1 / 100;
        this.Tax_Rate_Pay_Tax = this.data[this.Filing_Status][i].tax_rate_pay_tax;
        this.Tax_Rate_Pay_Tax_K1 = this.data[this.Filing_Status][i].tax_rate_pay_tax_k1;
        this.Range_Start = this.data[this.Filing_Status][i].range_start;

        break;
      }
    }

    this.Excess_Income = this.Adjusted_Taxable_Income - this.Range_Start;
    this.Tax_On_Excess = this.Excess_Income * (this.Tax_Bracket);
    this.Estimated_Tax_Due = this.Tax_On_Excess + this.Tax_Rate_Pay_Tax;
    this.Adjusted_Net_Income = this.Adjusted_Taxable_Income - this.Estimated_Tax_Due;
    this.Tax_Liability = this.Estimated_Tax_Due;
  }

  // Calculate the K1 with value
  compare_k2() {
    if (this.panel_visit == 1) {
      this.Deduction_K1 = this.Investment_Amount_K1_model * (this.k1_deduction_percentage / 100);
      this.Adjusted_Taxable_Income_K1 = this.Estimated_Taxable_Income_model - this.Deduction_K1;

      for (var i = 0; i < this.data[this.Filing_Status].length; i++) {
        if (this.data[this.Filing_Status][i].range_start <= this.Adjusted_Taxable_Income_K1 && this.Adjusted_Taxable_Income_K1 <= this.data[this.Filing_Status][i].range_end) {
          this.Tax_Bracket_K1 = this.data[this.Filing_Status][i].percent_on_excess_k1 / 100;
          this.Tax_Rate_Pay_Tax_K1 = this.data[this.Filing_Status][i].tax_rate_pay_tax_k1;
          this.Range_Start = this.data[this.Filing_Status][i].range_start;
        }
      }

      this.Excess_Income_K1 = this.Adjusted_Taxable_Income_K1 - this.Range_Start;
      this.Tax_On_Excess_K1 = this.Excess_Income_K1 * (this.Tax_Bracket_K1);
      this.Estimated_Tax_Due_K1 = this.Tax_On_Excess_K1 + this.Tax_Rate_Pay_Tax_K1;
      this.Adjusted_Net_Income_K1 = this.Adjusted_Taxable_Income_K1 - this.Estimated_Tax_Due_K1;
      this.Tax_Savings_K1 = this.Estimated_Tax_Due - this.Estimated_Tax_Due_K1;
      this.Tax_Liability_K1 = this.Estimated_Tax_Due_K1;
      this.Partnership_Investment = this.Investment_Amount_K1_model;
      this.Income_Difference = this.Adjusted_Net_Income - this.Adjusted_Net_Income_K1;
      this.Actual_Dollars_At_Risk = this.Investment_Amount_K1_model - this.Income_Difference;
    }
  }

  // Changing the Panel Icon
  onclicktoggle(idname: string) {
    let icon = "";
    if (idname === "accordion1") {
      icon = "icon1";
    }

    else {
      icon = "icon2";
    }

    let cN = document.getElementById(icon).className;

    if (icon === "icon1") {

      if (document.getElementById("icon2").className === "glyphicon glyphicon-minus") {
        document.getElementById("icon2").className = "glyphicon glyphicon-plus";
      }

      if (cN === "glyphicon glyphicon-plus") {
        document.getElementById(icon).className = "glyphicon glyphicon-minus";
      }
      else {
        document.getElementById(icon).className = "glyphicon glyphicon-plus";
      }
    }

    else {
      if (document.getElementById("icon1").className === "glyphicon glyphicon-minus") {
        document.getElementById("icon1").className = "glyphicon glyphicon-plus";
      }

      if (cN === "glyphicon glyphicon-plus") {
        document.getElementById(icon).className = "glyphicon glyphicon-minus";
      }
      else {
        document.getElementById(icon).className = "glyphicon glyphicon-plus";
      }
    }
  }
}