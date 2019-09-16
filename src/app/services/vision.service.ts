import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from '../util/constants';
import { Observable } from 'rxjs';
import { VisionDTO } from '../entity/VisionDTO';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VisionService {
  private hostApi = Constants.TERRABRASILIS_BUSINESS_API_HOST;
  
  constructor(
    private http:HttpClient 
  ) { }

  /**
   * API: GET vision/name/{desforestation}/all
   */
  public getVisionAndAllRelationshipmentByName(name:string): Observable<any> {
    return this.http.get(this.hostApi + "vision/name/" + name + "/all")
                    .map(res => res)
                    .catch(err=> Observable.throw(err.message));      
  }
}
