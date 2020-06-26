import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as csv from 'csvtojson';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataService {
    constructor(private http: HttpClient) { }

    getCSVData() {
        const options: {
            headers?: HttpHeaders;
            observe?: 'body';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType: 'text';
            withCredentials?: boolean;
        } = {
            responseType: 'text'
        };

        // tslint:disable-next-line: max-line-length
        return this.http.get('https://docs.google.com/spreadsheets/d/1RPCryGL8_eO0Mfv3JAagKYoEuk2fQN7FIpPXfOxZv_w/gviz/tq?tqx=out:csv&sheet=Sheet1', options)
    }
}
