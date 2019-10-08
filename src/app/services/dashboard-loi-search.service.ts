import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { DeforestationOptionsComponent } from '../dashboard/deforestation/deforestation-options/deforestation-options.component'

@Injectable()
export class DashboardLoiSearchService {

  lois: Array<Object>;
  panelReference: DeforestationOptionsComponent;

  constructor(private deforestationOptionsComponent: DeforestationOptionsComponent) {
    this.panelReference=deforestationOptionsComponent;
  }

  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term: any) {
    let results:Array<{key:any,value:any}>=new Array();
    function searchInMapElements(element: any) {
      if(element.value.indexOf(term.toUpperCase())>=0) {
        results.push({key:element.key,value:element.value});
        results = results.sort(function(a:any, b:any) {
                    return ('' + a.value).localeCompare(b.value);
                  });
      }
    }
    this.lois = this.panelReference.getLoiNames();
    this.lois.forEach(searchInMapElements);
    //new Array<{key:any,value:any}>();
    const simpleObservable = new Observable<{key:any,value:any}>(
      (observer) => {
        results.forEach(
          (result) => {
            observer.next(result)
          }
        );
        observer.complete();
      }
    );
    return simpleObservable;
  }
}
