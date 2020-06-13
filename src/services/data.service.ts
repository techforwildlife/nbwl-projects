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
            responseType: 'arraybuffer';
            withCredentials?: boolean;
        } = {
            responseType: 'arraybuffer'
        };

        // tslint:disable-next-line: max-line-length
        return this.http.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8LnLZGC9-KBpNHuCU-wIYVb9c4eb0GCZY4WEuDKqmmuVR1mNxaRuLnkblXV-Oioqqo-iBfTu0JFYQ/pub?gid=0&single=true&output=csv', options)
        .pipe(
            map((rawResponse: any) => {
                if ('TextDecoder' in window) {
                  // Decode as UTF-8
                  const dataView = new DataView(rawResponse);
                  const decoder = new TextDecoder('utf8');
                  const decodedString = decoder.decode(dataView);
                  return csv().fromString(decodedString);
                } else {
                  // Fallback decode as ASCII
                  const decodedString = String.fromCharCode.apply(null, new Uint8Array(rawResponse));
                  return csv().fromString(decodedString);
                }
                return null;
              })
         );
    }
}
