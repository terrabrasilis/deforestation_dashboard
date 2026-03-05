import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../util/constants';

@Injectable() 
export class DashboardApiProviderService {
  
  private dashboardAPIHost: string;
  
  /* main resources json */
  private loisResource = "config/lois/";
  private loinamesResource = "config/loinames/";
  private classesResource = "config/classes/";
  private periodsResource = "config/periods/";

  /* local of interests json */
  private ufResource = "config/uf/";
  private munResource = "config/mun/";
  private consunitResource = "config/consunit/";
  private indiResource = "config/indi/";
  //private biomesResource = "config/bioma/";
  //private pathrowResource = "config/pathrow/";
  
  /* deforestation all */
  private deforestation = "data/";
    
  constructor(private http: HttpClient) {
    this.dashboardAPIHost = Constants.DASHBOARD_API_HOST;
  }

  getLois(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.loisResource+fileName+'.json'+Constants.AVOID_CACHE);
  }

  getLoinames(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.loinamesResource+fileName+'.json'+Constants.AVOID_CACHE);
  }

  getClasses(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.classesResource+fileName+'.json'+Constants.AVOID_CACHE);
  }

  getPeriods(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.periodsResource+fileName+'.json'+Constants.AVOID_CACHE);
  }

  getUF(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.ufResource+fileName+'.json'+Constants.AVOID_CACHE);
  }

  getMun(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.munResource+fileName+'.json'+Constants.AVOID_CACHE);
  }
  
  getConsUnit(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.consunitResource+fileName+'.json'+Constants.AVOID_CACHE);
  }

  getIndi(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.indiResource+fileName+'.json'+Constants.AVOID_CACHE);
  }

  // getBiomes(fileName: any) {
  //   return this.http.get(this.dashboardAPIHost+this.biomesResource+fileName+'.json'+Constants.AVOID_CACHE);
  // }

  // getPathRow(fileName: any) {
  //   return this.http.get(this.dashboardAPIHost+this.pathrowResource+fileName+'.json'+Constants.AVOID_CACHE);
  // }

  getDeforestation(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.deforestation+fileName+'.json'+Constants.AVOID_CACHE);
  }

  getLastUpdatedDate() {
    return this.http.get(Constants.LAST_UPDATE_DATE);
  }

  getDeforestationRates() {
    return this.http.get(Constants.FILE_RATES);
  }

}
