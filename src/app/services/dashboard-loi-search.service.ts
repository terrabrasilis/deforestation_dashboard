import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { DeforestationOptionsComponent } from '../dashboard/deforestation/deforestation-options/deforestation-options.component'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DashboardLoiSearchService {

  lois: Array<Object>;
  panelReference: DeforestationOptionsComponent;

  constructor(private deforestationOptionsComponent: DeforestationOptionsComponent,
    private http: HttpClient) {
    this.panelReference=deforestationOptionsComponent;
  }

  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term: any) : Array<{key:any,value:any}>
  {
    let results:Array<{key:any,value:any}>=new Array();
    function searchInMapElements(element: any) {
      if(term=="" || element.value.toUpperCase().includes(term.toUpperCase())) {
        results.push({key:element.key,value:element.value});
        results = results.sort(function(a:any, b:any) {
                    return ('' + a.value).localeCompare(b.value);
                  });
      }
    }
    this.lois = this.panelReference.getLoiNames();

    this.lois.forEach(searchInMapElements);       
    
    // const simpleObservable = new Observable<{key:any,value:any}>(
    //   (observer) => {
    //     results.forEach(
    //       (result) => {
    //         observer.next(result)
    //       }
    //     );
    //     observer.complete();
    //   }
    // );
    return results;
  }
  getPrioritiesCities() {
    
    //let getFeatureURL = "/geoserver/prodes-brasil-nb/ows?OUTPUTFORMAT=application/json&SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&exceptions=text/xml&srsName=EPSG:4326&TYPENAME=prodes-brasil-nb:priority_municipalities";
    let getFeatureURL = "http://localhost/priority-cities";
    let httpOptions = {
      headers: new HttpHeaders({}),
    };

    return this.http.get(getFeatureURL, httpOptions);
  }

}


