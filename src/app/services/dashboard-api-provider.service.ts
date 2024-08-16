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
    return this.http.get(this.dashboardAPIHost+this.loisResource+fileName+'.json');
  }

  getLoinames(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.loinamesResource+fileName+'.json');
  }

  getClasses(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.classesResource+fileName+'.json');
  }

  getPeriods(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.periodsResource+fileName+'.json');
  }

  getUF(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.ufResource+fileName+'.json');
  }

  getMun(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.munResource+fileName+'.json');
  }
  
  getConsUnit(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.consunitResource+fileName+'.json');
  }

  getIndi(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.indiResource+fileName+'.json');
  }

  // getBiomes(fileName: any) {
  //   return this.http.get(this.dashboardAPIHost+this.biomesResource+fileName+'.json');
  // }

  // getPathRow(fileName: any) {
  //   return this.http.get(this.dashboardAPIHost+this.pathrowResource+fileName+'.json');
  // }

  getDeforestation(fileName: any) {
    return this.http.get(this.dashboardAPIHost+this.deforestation+fileName+'.json');
  }

  getDeforestationRates() {
    return this.http.get(Constants.FILE_RATES);
  }

}
