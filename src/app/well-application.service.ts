import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class WellApplicationServices {
    constructor(private http: Http) {
    }

    public getOneMileJSON() {
        return this.http.get('assets/WellDetails.json')
            .map((response: Response) => {
                return response.json().OneMile;
            })
    }

    public getThreeMilesJSON() {
        return this.http.get('assets/WellDetails.json')
            .map((response: Response) => {
                return response.json().ThreeMiles;
            })
    }

    public getFiveMilesJSON() {
        return this.http.get('assets/WellDetails.json')
            .map((response: Response) => {
                return response.json().FiveMiles;
            })
    }



}