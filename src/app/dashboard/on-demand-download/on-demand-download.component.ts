import {  Component, 
          OnInit } from '@angular/core';

import {  HttpClient, 
          HttpHeaders, 
          HttpParams } from '@angular/common/http';

import {  ISubscription } from "rxjs/Subscription";

import {  Observable  } from 'rxjs/Observable';

import {  forkJoin  } from "rxjs/observable/forkJoin";

import { DashboardApiProviderService } from '../../services/dashboard-api-provider.service';

import { DeforestationOptionsUtils } from '../../util/deforestation-options-utils';

import { Constants } from '../../util/constants';

import {  ActivatedRoute, 
          Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import * as d3 from "d3";

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-on-demand-download',
  templateUrl: './on-demand-download.component.html',
  styleUrls: ['./on-demand-download.component.css']
})
export class OnDemandDownloadComponent implements OnInit {

  states: Array<Object> = new Array();
  statesBlk1: Array<Object> = new Array();
  statesBlk2: Array<Object> = new Array();
  type: string;
  statesObservable: Observable<any>;
  dataObservable: Observable<any>;
  loiNamesObservable: Observable<any>;
  value: string;
  private biomeSubscription: ISubscription;
  private typeSubscription: ISubscription;
  public httpOptions: any;
  
  private dataJson: any;
  private loiNamesJson: any;
  private biome: any;
  //private DB_NoContain:any;

  constructor(private route: ActivatedRoute,    
              private router: Router,
              private dashboardApiProviderService: DashboardApiProviderService,
              private _translate: TranslateService,
              private httpClient: HttpClient) {

    this.biomeSubscription = this.route.params.subscribe(params => this.biome = params["biome"].replace("-", " "));
    this.typeSubscription = this.route.params.subscribe(params => this.type = params["type"].replace("-", " "));

    //this.DB_NoContain = true;

    this.states = Constants.DASHBOARD_STATES.get(this.biome);
    
    // if (this.biome == "cerrado")
    //   this.states = Constants.DASHBOARD_CERRADO_STATES;
    // else
    // if (this.biome == "amazon") {
    //   //this.states = Constants.DASHBOARD_AMAZON_STATES;
    //   this.biome = "legal_amazon";
    //   this.DB_NoContain = false;
    // }
    // else
    //   if (this.biome == "legal_amazon") 
    //     this.states = Constants.DASHBOARD_LEGAL_AMAZON_STATES;
    
    this.states.sort();
    let half=parseInt( ( (this.states.length%2)?( (this.states.length/2)+1 ):( this.states.length/2 ) )+""  );
    this.statesBlk1=this.states.slice(0,half);
    this.statesBlk2=this.states.slice(half,this.states.length);
    this.httpOptions = { headers: new  HttpHeaders(
      { 'App-Identifier': 'prodes_'+this.biome}
    )};

    // if (this.DB_NoContain == false)
    //   this.biome = "amazon";

    this.dataObservable = this.dashboardApiProviderService.getDeforestation(this.httpOptions);  
    
    this.loiNamesObservable = this.dashboardApiProviderService.getLoinames(this.httpOptions); 
  
          
  }

  ngOnInit() { }

  clickHandler():void {

    forkJoin([this.dataObservable, this.loiNamesObservable]).subscribe(data => {
      this.dataJson = data[0];
      this.loiNamesJson = data[1];
      this.downloadCSV();      
    });
    
  }

  downloadCSV():void {

    // configuration to generate CSV
    let fraction=$("input[name='fraction']:checked").val();
    let accent=$("input[name='accent']:checked").val()=="on";

    // call function inside this
    var checkedValues = $('input:checkbox:checked').map(
      function():any {
        return $(this).val();
      }
    ).get();

    if(!checkedValues.length) {
      $('#missselect').show();
      return;
    }else{
      $('#missselect').hide();
    }

    var loiNames = new Map<number, string[]>();
    this.loiNamesJson.lois.filter(
      (filteredLoi:any) => {
        return filteredLoi.gid === 2;
      }
    ).map(
      (loi:any) => {
        DeforestationOptionsUtils.setLoiNamesDownload(loi, loiNames, checkedValues);
      }
    );

    var allFeatures:any[];
    if (this.type == "increments")
      allFeatures = DeforestationOptionsUtils.dataWranglingIncrements(this.dataJson, this.biome);
    else
      allFeatures = DeforestationOptionsUtils.dataWranglingRates(this.dataJson);
    
    var dataCSV = allFeatures.filter(
      (filteredFeatures:any) => {
        return filteredFeatures.loi === 2;
      }
    ).filter(
      (filteredFeatures:any) => {     
        return filteredFeatures.loiName in loiNames;
      }
    ).map(
      (feature:any) => {
        let mun=loiNames[feature.loiName][0],
        uf=loiNames[feature.loiName][1],
        geocode=(loiNames[feature.loiName][2])?(loiNames[feature.loiName][2]):('-'),
        a=feature.area;

        if(accent) {
          mun=mun.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          uf=uf.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        }
        if(fraction=="comma") {
          a=(a+"").replace('.',',');
        }
        return {
          year: feature.endDate,
          'areakm': a,
          //'>1ha': feature.area,
          //'>6.25ha': feature.filteredArea,
          municipality: mun,
          geocode_ibge: geocode,
          state: uf
        }
      }
    );
    
    dataCSV.sort(function (a, b) {
      var aMunicipality = a.municipality;
      var bMunicipality = b.municipality;
      var aState = a.state;
      var bState = b.state;
      var aYear = a.year;
      var bYear = b.year;
     
      if(aState == bState) {
        if(aMunicipality == bMunicipality)
        {
            return (aYear < bYear) ? -1 : (aYear > bYear) ? 1 : 0;
        }
        else
        {
            return (aMunicipality < bMunicipality) ? -1 : 1;
        }
      }
      else {
        return (aState < bState) ? -1 : 1;
      }

    });

    let d3DSV=(fraction=="comma")?(d3.dsvFormat(";").format(dataCSV)):(d3.csvFormat(dataCSV));

    let blob = new Blob([d3DSV], {type: "text/csv;charset=utf-8"}),
    dt = new Date(),
    dt1 = dt.toLocaleString();
    dt1 = dt1.replace('/','_');
    dt1 = dt1.replace(' ','_');
    dt1 = dt1.replace(':','_');
    let fileName = 'terrabrasilis_'+this.biome+'_'+dt1+'.csv';
    FileSaver.saveAs(blob, fileName);
  }
}
