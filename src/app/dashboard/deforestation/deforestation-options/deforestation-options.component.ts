import {  Component, 
          OnInit,
          ChangeDetectorRef } from '@angular/core';

import {  HttpHeaders } from '@angular/common/http';

import {  ISubscription } from "rxjs/Subscription";
import {  Observable  } from 'rxjs/Observable';
import {  forkJoin  } from "rxjs/observable/forkJoin";

import {  DialogComponent } from "../../../dialog/dialog.component";
import {  MatDialog } from "@angular/material";
import { DomSanitizer } from '@angular/platform-browser';

import { ActivatedRoute, Router } from '@angular/router';

import { DeforestationOptionsUtils } from '../../../util/deforestation-options-utils';
import { Constants } from '../../../util/constants';

import { DashboardApiProviderService } from '../../../services/dashboard-api-provider.service';

import * as Terrabrasilis from "terrabrasilis-api";
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';
import * as dc from 'dc';
import * as FileSaver from 'file-saver';

/* Translate */
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../services/local-storage.service';

import { ContactComponent } from '../../../contact/contact.component';

declare var $ : any;

declare var Authentication: any;

declare var notifyLanguageChanged: Function;

export interface Class {
  value: string;
  viewValue: string;
}

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-deforestation-options',
  templateUrl: './deforestation-options.component.html',
  styleUrls: ['./deforestation-options.component.css'],  
  encapsulation: 3  
})

export class DeforestationOptionsComponent implements OnInit  {

  imgPath:string=( process.env.ENV === 'production' && process.env.BUILD_TYPE === 'production' )?('/app/dashboard/deforestation/'):('');
  
  // variables definition
  biome: string;
  type: string;
  project: string;
  selectedClass: string;
  selectedLoi: string;
  classes: Class[];
  lois: Class[];
  maxLoi: any;

  trashIcon: string; 
  
  loadGrid: any;
  setMaskDisplay: any;
  includeMask: boolean;
  geojsonLayers:any;
  listCharts:any;
  rowChart:any;
  barChart:any;
  area:any;
  filteredArea:any;
  seriesChart:any;
  legendSize: any;
  tagId:any;
  minDate: any;
  maxDate: any;
  labelRegularArea: any;
  labelFilteredArea: any;
  tableYear: any;
  tableRegular: any;
  // tableLess: any;
  tableTotal: any;
  initTab: any;
  ctrlSto: any;

  private biomeSubscription: ISubscription;
  private typeSubscription: ISubscription;
  
  private dataObservable: Observable<any>;
  private mapObservable: Observable<any>;
  private dataLoinamesObservable: Observable<any>;
  
  private dataJson: any;
  private dataLoinamesJson: any;
  private mapJson: any;
  
  // use for make tables
  private tableArea: any;
  private tableDateDim: any;
  private ctrlTableTimeOut: any;
  private loiNameDim: any;
  private tableTotalAreaByLoiName: any;
  private areaByDate: any;
  private filteredAreaByDate: any;
  private areaByLoiName: any;

  // dashboard title
  private loiname: String;
  private translatedLoiname: String;
  private selectedTime: any="";
  private translatedTime: String;

  private loiNames: Map<number, string>;
  private loiGeocodes: Map<number, number>;
  private loiNamesObject: Array<Object>;

  public httpOptions: any;

  public barPadding: any;
  public BAR_PADDING: any;

  private labelArea: string;
  private labelRates: string;
  private languageKey: string = "translate";
  private lang: string;

  private last_update_date: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dom: DomSanitizer,
              public dialog: MatDialog,
              private dashboardApiProviderService: DashboardApiProviderService,
              private _translate: TranslateService,
              private localStorageService: LocalStorageService,
              private cdRef: ChangeDetectorRef
            ) {
    
    // create subscription for biome data
    this.biomeSubscription = this.route.params.subscribe(params => this.biome = params["biome"].replace("-", " "));
    this.typeSubscription = this.route.params.subscribe(params => this.type = params["type"].replace("-", " "));

    this._translate.onLangChange.subscribe( (ev:any)=>{
      this.loiname=this.translatedLoiname=ev.translations.dashboard.filters.loiname.all;
      this.selectedTime=this.translatedTime=ev.translations.dashboard.filters.time.all;
    });

    this.httpOptions = { headers: new  HttpHeaders(
      { 'App-Identifier': 'prodes_'+this.biome}
    )};

    this.lois = [
      {value: "uf", viewValue: 'States'}, 
      {value: "mun", viewValue: 'Municipalities'}, 
      {value: "consunit", viewValue: 'Conservation Units'}, 
      {value: "indi", viewValue: 'Indigeneous Areas'}
    ];

    this.classes = [
      {value: 'deforestation', viewValue: 'Deforestation'}
    ];

    this.selectedLoi = this.lois[0].value;
    this.selectedClass = this.classes[0].value;
    this.BAR_PADDING = .1;
    this.barPadding = undefined;

    if (this.type == "rates")
      this.selectedClass = this.selectedClass+"_rates";
      
    // remove loading tag
    $(".loading-overlay, .loading-overlay-content").remove();

    this.maxLoi = 13;
    
    this.last_update_date = Constants.LAST_UPDATE_DATE;

    this.includeMask=false;
  }

  ngOnInit() {
        
    // define the height for div content using the div identifier: "myTabContent"
    // (sub-bar + filters-bar + header + footer)
    let h = $(window).height() - ($('#sub-bar-options').height() + $('#title-chart').height() + $('#content').height() + $('.footer').height());
    $('#myTabContent').height( h );

    if (!this.checkBiome())
      this.dialog.open(DialogComponent, {width : '450px'});

    this.localStorageService.getValue(this.languageKey).subscribe(
      (value:any) => {
        let l=JSON.parse(value);
        this.lang=(l===null)?('pt-br'):(l.value);

        this._translate.setDefaultLang(this.lang);

        this.last_update_date=(new Date(Constants.LAST_UPDATE_DATE+'T12:00:00.000Z')).toLocaleDateString(this.lang);
        
        let currentRateNotes=(Constants.BARCHART_PRELIMINARY_DATA_YEAR)?('dashboard.modals.warning_rates'):('dashboard.tooltip.rates');
        let currentIncreaseNotes=(Constants.BARCHART_PRELIMINARY_DATA_YEAR)?('dashboard.modals.warning_increase'):('dashboard.tooltip.incr');
        if (this.type == "rates"){
          this._translate.get(currentRateNotes).subscribe((text) => {
            let msg=text;
            let dialogRef = this.dialog.open(DialogComponent, {width : '450px'});
            dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(msg);
          });
        }else if(this.biome == "legal_amazon" || this.biome == "amazon") {
          this._translate.get(currentIncreaseNotes).subscribe((text) => {
            let msg=text;
            let dialogRef = this.dialog.open(DialogComponent, {width : '450px'});
            dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(msg);
          });
        }
      }
    );
    
    // draw grid
    this.drawGrid();

    // change tab event
    var self = this;
    $(".mr-auto a.nav-link").click(function() {
      var idx = self.lois.findIndex(function(el) {
        return el.value == self.selectedLoi;
      });
      // match tab index with loi
      var id:any = $(this).find("span").attr("id");
      if (!(idx == Number(id))) {
        self.resetFilters(self);
        self.selectedLoi = self.lois[Number(id)].value;
        self.getMap();
      }
      $('li.nav-item.active').removeClass('active');      
      $(this).closest('li').addClass('active');      
    });

    if (this.type == "rates") 
      $("a.rates").closest('li').addClass("enable_menu");      
    else
      $("a."+this.biome).closest('li').addClass("enable_menu");
    
    // // get data 
    // this.getData(this.selectedClass);

    // used to call functions ouside Angular (devel)
    //window["dashboard"]=function(){return self;};

    this.initAuthentication();
  }

  ngOnDestroy() {
    
    // cancel subscription for biome data
    this.biomeSubscription.unsubscribe();
    this.typeSubscription.unsubscribe();
  }

  filterByLoi(key:number) {
    this.applyCountyFilter(key);
    dc.redrawAll();
  }

  applyCountyFilter(key:number){
    let self=this;
    if(!key) {
			this.rowChart.data(function (group:any) {
				let fakeGroup:any=[];
				fakeGroup.push({key:'no value',value:0});
				return (group.all().length>0)?(group.top(self.maxLoi)):(fakeGroup);
			});
		}else{
			
      this.rowChart.data(function (group:any) {
        let filteredGroup:any=[], index:number=-1, allItems:any=group.top(Infinity);
        
				allItems.findIndex(function(item:any,i:number){
					if(item.key==key){
						index=i;
						filteredGroup.push({key:item.key,value:item.value});
          }          
        });

        if (index == -1) {
          let fakeGroup:any=[];
          fakeGroup.push({key:'no value',value:0});
          return (group.all().length>0)?(group.top(self.maxLoi)):(fakeGroup);            
        }

        let ctl:number=1, max:any=[], min:any=[];
        
				while (max.length <= self.maxLoi && min.length <= self.maxLoi && (max.length+min.length+1) <= self.maxLoi) {
          
          let item:any=allItems[index+ctl];
          if(item) min.push({key:item.key,value:item.value});

					item=allItems[index-ctl];
          if(item) max.push({key:item.key,value:item.value});

          ctl++;

          if (max.length == allItems.length || min.length == allItems.length || max.length+min.length+1 == allItems.length)
            break;

        }
        
				filteredGroup=filteredGroup.concat(max);
				min.reverse();
				filteredGroup=min.concat(filteredGroup);
        filteredGroup.reverse();
        
				return filteredGroup;
      });

			// -----------------------------------------------------------------
			// enable this line if you want to clean municipalities of the previous selections.
			//this.rowChart.filterAll();
			// -----------------------------------------------------------------
			this.rowChart.filter(key);
			dc.redrawAll();
		}
	}

  /**
   * Used by search service.
   */
  getLoiNames(): Array<Object> {
    let self = this;
    var keys = self.rowChart.group().top(Infinity).map(function(element:any) {
      return element.key;
    });

    var aux = this.loiNamesObject.filter(
                                  (element:any) => {
                                    return keys.indexOf(element.key) > -1;
                                  }                                  
                                );

    return aux;
  }

  chartDownloadCSV(chartId:any):void {
    let targetChart = this.listCharts.get(chartId);
    let filters=(targetChart.hasFilter())?(targetChart.filters()):([]);
    let csv=[],content=null,fileType="text/csv;charset=utf-8",fileExtension='csv';
    switch (chartId) {
      case 'bar-chart':
        csv=this.prepareBarChartToDownload(targetChart.group().all());
        content=this.csvFormat(csv);
        break;

      case 'loi-chart':
        csv.length=this.mapJson.features.length;
        content=JSON.stringify(this.mapJson);
        fileType="text/json;charset=utf-8";
        fileExtension='json'
        break;
    
      case 'series-chart':
        csv=this.prepareSeriesChartToDownload(targetChart.data());
        Terrabrasilis.disableLoading("#series-chart");
        content=this.csvFormat(csv);
        break;
      
      case 'row-chart':
        csv=this.prepareRowChartToDownload(targetChart.group().all(),filters);
        content=this.csvFormat(csv);
        break;

      case 'tb-area':
        csv=this.downloadDataTableCSV();
        content=this.csvFormat(csv);
        break;
    }

    if(csv && csv.length) {
      let blob = new Blob([content], {type: fileType}),
      dt = new Date(),
      fileName=dt.getDate() + "_" + dt.getMonth() + "_" + dt.getFullYear() + "_" + dt.getTime();
      FileSaver.saveAs(blob, 'terrabrasilis_'+this.biome+'_'+fileName+'.'+fileExtension);
    }else{
      alert('Não há dados para exportar.');
    }
  }

  prepareBarChartToDownload(data:any) {
    // call function inside this
    let self = this;
    let formater=DeforestationOptionsUtils.numberFormat(self.lang);
    let csv:any=[];
    if(data && data.length) {
      data.forEach(function(d:any) {
        let aux = {
          "year":d.key,
          "area km²":formater(d.value)
        }      
        csv.push(aux);
      });
    }
    return csv;
  }

  prepareRowChartToDownload(data:any,filters:Array<any>) {
    // call function inside this
    let self = this;
    let formater=DeforestationOptionsUtils.numberFormat(self.lang);
    let csv:any=[];
    if(data && data.length) {
      data.forEach(function(d:any) {
        if(!filters.length || filters.includes(d.key)) {
          let  aux={};
          aux[self.selectedLoi]=self.loiNames[d.key];
          aux["area km²"]=formater(d.value);
          if(self.loiGeocodes && self.loiGeocodes[d.key]) {aux["geocode_ibge"]=self.loiGeocodes[d.key]}
          csv.push(aux);
        }
      });
    }
    return csv;
  }

  prepareSeriesChartToDownload(data:any) {
    // call function inside this
    let self = this;
    let formater=DeforestationOptionsUtils.numberFormat(self.lang);
    let csv:any=[];
    if(data && data.length) {
      data.forEach(function(d:any) {
        let aux = {
          "year":d.key[1],
          "area km²":formater(d.value)
        };
        aux[self.selectedLoi]=self.loiNames[d.key[0]];
        if(self.loiGeocodes && self.loiGeocodes[d.key[0]]) {aux["geocode_ibge"]=self.loiGeocodes[d.key[0]]}
        csv.push(aux);
      });
    }
    return csv;
  }

  prepareLoiChartToDownload(data:any) {
    // call function inside this
    let self = this;
    let formater=DeforestationOptionsUtils.numberFormat(self.lang);
    let csv:any=[];
    if(data && data.length) {
      data.forEach(function(d:any) {
        let aux = {
          "year":d.key,
          "area km²":formater(d.value)
        }      
        csv.push(aux);
      });
    }
    return csv;
  }

  /**
   * Used to generate the CSV and push as stream to download by browser.
   */
  downloadDataTableCSV() {
    // call function inside this
    let self = this;
    let formater=DeforestationOptionsUtils.numberFormat(self.lang);
    let allData=this.tableDateDim.top(Infinity);
    let csv:any=[];
    allData.forEach(function(d:any) {
      let aux = {
        "year":d.endDate,
        "area km²":formater(d.area)
      }      
      aux[self.selectedLoi] = self.loiNames[d.loiName];
      if(self.loiGeocodes && self.loiGeocodes[d.loiName]) {aux["geocode_ibge"]=self.loiGeocodes[d.loiName]}
      csv.push(aux);
    });
    return csv;
  }

  csvFormat(json:any):any {
    let dsv=d3.dsvFormat(';');
    return dsv.format(json);
  }

  // check biome in the url 
  checkBiome():boolean {

    let value = Constants.DASHBOARD_BIOMES_NAMES.indexOf(this.biome.toLowerCase().replace(" ", "-")) > -1;
    
    if (!value)
      this.biome = null;    

    return value;

  }

  drawGrid():void {

    // call function inside this
    var self = this;

    $(function () {
      
      // define options for gridstack (e.g., size, resizable handles, tolerance to remove, etc.)
      var options = {  
          width: 12,
          float: false,
          removable: '.removable',
          removeTimeout: 100,
          tolerance: "pointer",
          acceptWidgets: '.grid-stack-item',
          alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
          resizable: {
              handles: 'e, se, s, sw, w'
          }
      };
      
      // define two grids (main and side)
      $('#main-grid').gridstack(options);      
      
      // assign main and nav grid to gridstack 
      var mainGrid = $('#main-grid').data('gridstack');
      
      // params -> [tag, x: number, y: number, width: number, height: number]
      function append2Grid(grid:any, tag:any, x:any, y:any, width:any, height:any) {
        grid.addWidget(tag, x, y, width, height);
      }
      
      // build main grid
      function buildMainGrid() {
        append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="aggregateTemporal">Aggregated Temporal Data </span> <i class="material-icons pull-right">open_with</i> </div><div id="bar-chart"></div></div></div>', 0, 0, 7, 6);
        append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="absoluteData"> Absolute Data </span> <i class="material-icons pull-right">open_with</i> </div><div id="row-chart"></div></div></div>', 8, 0, 5, 6);
        append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="timeSeries"> Time Series </span> <i class="material-icons pull-right">open_with</i> </div><div id="series-chart"></div></div></div>', 0, 7, 12, 6);
        append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="tableLois"> Area per years and Local of Interests </span> <i class="material-icons pull-right">open_with</i></div><div id="table-chart"><table id="tb-area" class="table table-hover dc-data-table dc-chart"></table></div></div></div>', 8, 15, 5, 6);
        append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="aggregateSpatial"> Aggregated Spatial Data </span> <i class="material-icons pull-right">open_with</i> </div><div id="loi-chart"></div></div></div>', 0, 15, 7, 6);
        $('.grid-stack-item').draggable({cancel: "#bar-chart, #loi-chart, #series-chart, #row-chart, #table-chart" });
      }
            
      buildMainGrid();
      
      // restore view when necessary 
      this.loadGrid = function () {
      
        // remove all the items from the main grid and add each widgets again
        mainGrid.removeAll();
        buildMainGrid();
        self.includeMask=false;
        self.makeGraphs(self.includeMask);
        self.makeTables();
        return false;

      }.bind(this);

      this.setMaskDisplay = function(e:any) {
        // remove all the items from the main grid and add each widgets again
        mainGrid.removeAll();
        buildMainGrid();
        self.includeMask=!self.includeMask;
        self.makeGraphs(self.includeMask);
        self.makeTables();
        return false;
      }.bind(this);
      
      // resizable and draggable gridstack
      $('#side-grid .grid-stack-item').resizable().draggable({
          revert: 'invalid',
          handle: '.grid-stack-item-content',
          scroll: true,
          appendTo: 'body'
      });

      function moreOptions() {
        let gsi=$('.grid-stack-item');
        for(let i=0;i<gsi.length;i++){
          // Disable download button of map until GeoJSON is fixed.
          if($(gsi[i]).find('#loi-chart').length) continue;
          let d1=document.createElement('div');
          d1.className="more_options";
          gsi[i].append(d1);
          let html='<button id="chartmenu_'+i+'" class="dropbtn"><i class="material-icons">menu</i></button>';
          $(d1).html(html);
          $('#chartmenu_'+i).on('click',(event:any)=>{
            if(event.target.nodeName=='DIV' && event.target.className=='chartdown') {
              self.chartDownloadCSV(event.target.id.split(':')[1]);
            }else {
              let dcChart=null,leafletMap=null;
              dcChart=$(event.currentTarget).parents('.grid-stack-item').find('.dc-chart');
              leafletMap=$(event.currentTarget).parents('.grid-stack-item').find('#loi-chart');
              let btid=(dcChart && dcChart.length)?(dcChart[0].id):( (leafletMap && leafletMap.length)?(leafletMap[0].id):(null) );
              if(btid) {
                if($('#dropdown-'+btid).length && $('#dropdown-'+btid).length==1) {
                  $('#dropdown-'+btid).attr('style','display:block;');
                }else{
                  let m=document.createElement('div');
                  m.className='down-context-menu';
                  m.id='dropdown-'+btid;
                  $(event.currentTarget).append(m);
                  let type=(btid=='loi-chart')?('GeoJSON'):('CSV');
                  let mHtml='<div class="dropdown-content">'+
                              '<div class="chartdown" id="chartdown:'+btid+'">Download '+type+'</div>'+
                            '</div>';
                  $(m).html(mHtml);
                }
              }
            }
          });
        }
        $('html').on('mouseover',()=>{
          setTimeout(() => {
            let items=$('.down-context-menu');
            for(let i=0;i<items.length;i++){
              $(items[i]).on('mouseout',()=>{
                $(items[i]).hide();
              });
            }
          },2500);
        });

        // get data. Try it here because HTML components was fail inside makeGraphs function when called after load data.
        self.getData(self.selectedClass);
      }

      // add on click handle loadGrid call for restore view button 
      $('#load_grid').click(this.loadGrid);

      // add on click handle viewMask call for display mask button 
      $('#load_mask').click(this.setMaskDisplay);

      moreOptions();
    });

  } 

  getData(selectedClass:any):void {

    // call of the required json for specific class
    switch(selectedClass) {
      case 'deforestation': {
        this.dataObservable = this.dashboardApiProviderService.getDeforestation(this.httpOptions);  
        break;         
      }
      case "deforestation_rates": {
        this.dataObservable = this.dashboardApiProviderService.getDeforestationRates(this.httpOptions);
        break; 
      }
    }
    
    // get all loinames
    this.dataLoinamesObservable = this.dashboardApiProviderService.getLoinames(this.httpOptions);
    
    // call function for map parameters    
    forkJoin([this.dataObservable, this.dataLoinamesObservable]).subscribe(data => {      
      this.dataJson = data[0];
      this.dataLoinamesJson = data[1];
      this.getMap();
    });
    
  }
  
  getMap():void {

    // call of the required json for specific loi
    switch(this.selectedLoi) {
      case "uf": {
        this.mapObservable = this.dashboardApiProviderService.getUF(this.httpOptions);
        break; 
      }  
      case "mun": {
        this.mapObservable = this.dashboardApiProviderService.getMun(this.httpOptions);
        break; 
      }
      case "consunit": {
        this.mapObservable = this.dashboardApiProviderService.getConsUnit(this.httpOptions);
        break; 
      }
      case "indi": {
        this.mapObservable = this.dashboardApiProviderService.getIndi(this.httpOptions);
        break; 
      }
    }

    this.mapObservable.subscribe(data => {
      this.mapJson = data;
      this.makeGraphs(this.includeMask);
      this.makeTables();
    });

  }

  getOrdinalColors(len:number): Array<any> {
    let c=[],cor=[];
    let schemes=["schemePaired","schemeCategory10","schemeAccent","schemeDark2","schemePastel1","schemePastel2","schemeSet1","schemeSet2"],sl=0;
    while(c.length<len) {
      cor=d3[schemes[sl]];
      for(let i=0;i<cor.length;i++) {
        c.push(cor[i]);
      }
      sl++;
    }
		return c;
	}

  makeTables(): void {
    
    // call function inside this
    let self = this;

    this.tableArea = dc.dataTable('#tb-area', 'tables');
    //let tableRelative = dc.dataTable('#tb-relative', 'tables');

    this.tableYear = 'Year';
    this.tableRegular = "Area (km²)";//(this.type!='rates')?("Area (km²) > 1.00ha"):("Area (km²)");
    //this.tableLess = "Area (km²) > 6.25ha";
    //this.tableTotal = "Total Area (km²)";

    this.tableArea
      .dimension(this.tableDateDim)
      .group(function (d:any) {
        
        let loiArea:Number=0;
        self.tableTotalAreaByLoiName.all()
        .find(function(item:any){
          if(item.key==d['loiName']){
            loiArea=item.value;
            return;
          };
        });
        let formater=DeforestationOptionsUtils.numberFormat(self.lang);
        return '<b>' + self.loiNames[d['loiName']] + '</b><span> - ' + formater(loiArea.valueOf()) + ' km²</span>';
      })
      .size(this.tableDateDim.top(Infinity).length)
      .sortBy(function(d:any) { return [d['loiName'], +d['endDate']].join(); })      
      .showGroups(true)
      .columns([
        {
          label: "",
          format: function(d:any) {
            
            return +d['endDate'];
          }
        },
        {
          label: this.tableRegular,
          format: function(d:any) {
            let formater=DeforestationOptionsUtils.numberFormat(self.lang);
            return formater(+d["area"]) + " km²";
          }
        }
      ])
      .order(d3.ascending)
      .on('renderlet', function (table:any) {
          table.selectAll('.dc-table-group').classed('info', true);
          let tc=$('#table-chart'),tcp=tc.parent(),tcs=tc.siblings();
          tc.height(tcp.height() - (tcs.height()+16));
      });

      // add one graph
      // this.listCharts.set('table-chart', this.tableArea);
      this.listCharts.set('tb-area', this.tableArea);
  }

  makeGraphs(includeMask:boolean):void {
    
    // call function inside this
    let self=this;
    var allFeatures:any[];
    
    // data wrangling - flatten nested data
    if (this.type == "increments")
      allFeatures = DeforestationOptionsUtils.dataWranglingIncrements(this.dataJson, includeMask);
    else
      allFeatures = DeforestationOptionsUtils.dataWranglingRates(this.dataJson);

    // get loiNames
    self.loiNames = new Map<number, string>();
    self.loiGeocodes = new Map<number, number>();
    self.loiNamesObject = new Array();

    this.dataLoinamesJson.lois
                          .filter(
                            (filteredLoi:any) => {
                              return filteredLoi.name === this.selectedLoi
                          })
                          .map(
                            (loi:any) => { 
                              if (loi.gid == 2)
                                  DeforestationOptionsUtils.setLoiNamesSplit(loi, self);
                              else
                                  DeforestationOptionsUtils.setLoiNames(loi, self);
                          });
    
    // filter and change loinames
    var filteredFeatures = allFeatures.filter(
      (filteredData:any) => {
        return filteredData.loiName in self.loiNames;
      }
    ).map(
      function(e:any) {
        return {
          endDate: e.endDate,
          loiName: e.loiName,
          area: e.area,
          filteredArea: e.filteredArea
        };
      }
    );
    
    // create a crossfilter instance [endDate, loiName, area, filteredArea]
    var ndx = crossfilter(filteredFeatures);
    
    // define dimensions
    var dateDim = ndx.dimension(
      function(d:any) { 
        return +d["endDate"];
      }
    );

    this.loiNameDim = ndx.dimension(
      function(d:any) { 
        return d["loiName"];
      }
    );

    var areaDim = ndx.dimension(
      function(d:any) { 
        return +d["area"]; 
      }
    );

    this.tableDateDim = ndx.dimension(
      function(d:any) { 
        return +d['endDate'];
      }
    );
    
    var loiNameYearDim = ndx.dimension( function(d:any):any {
      return [d["loiName"], +d["endDate"]];
    });

    // calculate metrics
    this.areaByDate = dateDim.group().reduceSum(
      function(d:any) {
        return +d["area"];
      }
    );

    this.filteredAreaByDate = dateDim.group().reduceSum(
      function(d:any) {
        return +d["filteredArea"];
      }
    );
    
    this.areaByLoiName = this.loiNameDim.group().reduceSum(
      function(d:any) {
        return +d["area"];
      }
    );

    this.tableTotalAreaByLoiName = this.loiNameDim.group().reduceSum(
      function(d:any) {
        return (+d["area"]);
      }
    );

    var areaByloiNameYear = loiNameYearDim.group().reduceSum(function(d:any) {
			return +d["area"];
    });

    var yearGroup = dateDim.group().reduceSum(function(d:any) {
			return +d["endDate"];
    });
    
    // define values (to be used in charts)
    this.minDate = dateDim.bottom(1)[0]["endDate"];
    this.maxDate = dateDim.top(1)[0]["endDate"]; 
    
    // define list of charts
    this.listCharts = new Map();
    var transition = 150;
    
    // define dc charts
    this.barChart = dc.compositeChart("#bar-chart");
		this.area = dc.barChart(this.barChart);
		// this.filteredArea = dc.barChart(this.barChart);

    this.seriesChart = dc.seriesChart("#series-chart");
    
    this.rowChart = dc.rowChart("#row-chart");

    let redrawMap:any={
      ctrlTimeout:0,
      call:function(mapJson:any, areaByLoiName:any, filteredLoiName:any) {
      
        function diff(arr1:any, arr2:any) {
          var ret = [];        
          for(var i = 0; i < arr1.top(Infinity).length; i += 1) {
              if(arr2.indexOf(arr1.top(Infinity)[i].key) > -1){
                  ret.push(arr1.top(Infinity)[i]);
              }
          }    
          if (!ret.length)          
            ret = areaByLoiName.top(Infinity);    
          return ret;
        };

        var auxAreaByLoiName:any = diff(areaByLoiName, filteredLoiName);

        var max:any = auxAreaByLoiName[0].value;

        var nro:number = Constants.MAP_LEGEND_GRADES;
        
        Terrabrasilis.setLegend(max, nro);
        Terrabrasilis.setColor(Constants.MAP_LEGEND_COLORS);

        var auxMapJson:any = Object.assign({}, mapJson);     
        auxMapJson["features"] = [];
          
        if (auxAreaByLoiName.length == areaByLoiName.top(Infinity).length) {
          mapJson["features"].forEach(function(feature:any) {
            
            var auxIndex = auxAreaByLoiName.findIndex(
                          (obj:any) => { return (self.loiNames[obj.key] == feature["properties"].name) }
                        );
            
            // if loiname exists
            if (auxIndex > -1) {
              feature["properties"].density = auxAreaByLoiName[auxIndex].value;
              auxMapJson["features"].push(feature);
            }

          });
        } else {
          auxAreaByLoiName.forEach(function(element:any, index:any, object:any) {
            
            var auxIndex = mapJson["features"].findIndex(
                          (obj:any) => { return (self.loiNames[element.key] == obj["properties"].name)}
                        );
            
            // if loiname exists
            if (auxIndex > -1) {   
              var currentIdx = auxMapJson["features"].push(mapJson["features"][auxIndex]) - 1;
              auxMapJson["features"][currentIdx]["properties"].density = element.value;            
            }

          });
        }

        if (Terrabrasilis.hasDefinedMap())  // map is already initialized
          Terrabrasilis.disableMap();          
        
        var geojsonLayers:any = [{
          "type": "Multipolygon",     
          "name": "loi",
          "active": true,
          "style": DeforestationOptionsUtils.style,
          "features": auxMapJson["features"]
        }];
    
        // mount a simple map 
        //-50, -13
        Terrabrasilis.map(0, 0, 5, 'loi-chart') 
                    .addBaseLayers()
                    .addGeoJsonLayers(geojsonLayers);
        
        Terrabrasilis.disableLoading("#loi-chart");

      }
    };

    // add one graph
    this.listCharts.set('loi-chart', "terrabrasilis-api");

    this._translate.get('dashboard.graph.label.area').subscribe((text) => {
      this.labelArea = text;
    });

    function snapToZero(sourceGroup:any) {
      return {
        all:function () {
          return sourceGroup.all().map(function(d:any) {
            return {key:d.key,value:( (Math.abs(d.value)<1e-6) ? 0 : d.value )};
          });
        },
        top: function(n:any) {
          return sourceGroup.top(Infinity)
            .filter(function(d:any){
              return (Math.abs(d.value)>1e-6);
              })
            .slice(0, n);
        }
      };
    };

    let text_bar="";
    self._translate.get( (this.type == "rates")?('dashboard.tooltip.rates_bar'):('dashboard.tooltip.incr_bar') ).subscribe((text) => {
      text_bar=text;
    });

    this.area
      .clipPadding(0)
      .barPadding(0.3)
      .group(snapToZero(this.areaByDate))
      .colors("#ffd76d")
      .valueAccessor(
        function (d:any) {
          return d["value"];
        }
      )
      .label(function(d:any) {
        return DeforestationOptionsUtils.formatTitle(d.data.value);
      })
      .title(
        function (d:any) {
          let formater=DeforestationOptionsUtils.numberFormat(self.lang);
          return text_bar + " " + d.key + "\n"+ formater(d.value) + " km²";
        }
      );
      
    var barChartWidth = $('#bar-chart')[0].offsetWidth;
    var barChartHeight = $('#bar-chart')[0].offsetHeight;

    this.barChart.width(barChartWidth+10)
      .height(barChartHeight)
      .shareTitle(false)
      .transitionDuration(transition)
      .margins({top: 10, right: 10, bottom: 50, left: 50})
      .dimension(dateDim)
      .group(snapToZero(this.areaByDate))
      .elasticY(true)
      .yAxisPadding('10%')
      //.xAxisLabel("Brazilian "+ this.biome.charAt(0).toUpperCase() + this.biome.slice(1)+" Monitoring Period: "+this.minDate+" - "+this.maxDate)
      .yAxisLabel(this.labelArea)
      .x(d3.scaleBand().rangeRound([0, barChartWidth]))
      .brushOn(false)
      .controlsUseVisibility(false)
      .addFilterHandler(function(filters:any, filter:any) {return [filter];})
      .xUnits(dc.units.ordinal)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      ._rangeBandPadding(0.2)
      .compose([this.area])
      // This code is needed only if we use two bars for each year to represents the área with more than one filter
      // .on("pretransition", (chart:any) => {
      //   Terrabrasilis.enableLoading("#bar-chart");
      //   var bars = chart.selectAll("rect.bar");

      //   if (self.area.hasFilter()) {
      //     bars.classed(dc.constants.DESELECTED_CLASS, true);
      //     bars._groups[0].forEach( (bar:any) => {
      //       if(self.area.filters().indexOf(bar.__data__.x) >= 0){
      //         bar.setAttribute('class', 'bar selected');
      //       }
      //     });
      //   } else {
      //       bars.classed(dc.constants.SELECTED_CLASS, true);
      //   }
      // });

    this.barChart.on('renderlet', function (chart:any) {
      
      var barLabels = chart.selectAll("text.barLabel");
      barLabels._groups[0].forEach( (bl:any) => {
        let y=bl.getAttribute('y');
        let x=bl.getAttribute('x');
        //let nx=(parseInt(x)+6);
        //bl.setAttribute('x',nx);
        bl.setAttribute('transform','rotate(300 '+x+', '+y+')');
      });

      if(self.biome == "legal_amazon" || self.biome == "amazon") {
        var bars = chart.selectAll("rect.bar");
        // define color to priority result of PRODES
        bars._groups[0].forEach( (bar:any) => {
          if(bar.textContent.indexOf(Constants.BARCHART_PRELIMINARY_DATA_YEAR) >= 0){
            bar.innerHTML="<title id='rates_bar_pri'>"+bar.textContent+"</title>";
            self._translate.get( (self.type == "rates")?('dashboard.tooltip.rates_bar_pri'):('dashboard.tooltip.incr_bar_pri') ).subscribe((text) => {
              text=text+" "+Constants.BARCHART_PRELIMINARY_DATA_YEAR+"\n"+$('#rates_bar_pri').text().split('\n')[1];
              $('#rates_bar_pri').text(text);
              bar.setAttribute('fill', '#ed6621');
            });
          }
        });
      }
      Terrabrasilis.disableLoading("#bar-chart");
    });

    this.barChart.on("renderlet.a",function (chart:any) {
      // rotate x-axis labels
      chart.selectAll('g.x text')
        .attr('transform', 'translate(-10,10) rotate(315)');
      $("#bar-chart > svg").attr("width", barChartWidth);
    });

    this.area.on('filtered', function(chart:any) {
      if (!chart.hasFilter()) {
        self.selectedTime = self.translatedTime;
        self.cdRef.detectChanges();
      }
        
    });

    this.area.filterPrinter(function(filters:any) {
      
      self.selectedTime = "[";
      var first = 1;
      filters.forEach(function(f:any) {
        if (first) {
          self.selectedTime = self.selectedTime.concat(f);
          first = 0;
        } else {
          self.selectedTime = self.selectedTime.concat(", ", f);
        }
      });        
      self.selectedTime = self.selectedTime + "]";
      self.cdRef.detectChanges();
    });

    // add one graph
    this.listCharts.set('bar-chart', this.barChart);

    var seriesChartWidth = $('#series-chart')[0].offsetWidth;
    var seriesChartHeight = $('#series-chart')[0].offsetHeight;

    self.legendSize = Constants.DASHBOARD_LEGEND_WIDTH_SERIES_CHART.get(this.selectedLoi);
    
    var auxYears:any=[],auxRates:any=[];
    yearGroup.all().forEach(function(y){
			auxYears.push(+y.key);
			auxRates.push(y.value);
    });

    var	seriesColors = this.getOrdinalColors(self.maxLoi);
    
		var xScale = d3.scaleLinear()
			.domain([auxYears[0] -1,auxYears[auxYears.length-1]+1])
      .range([auxRates[0],auxRates[auxRates.length-1]]);

    this.seriesChart.chart(function(c:any) {
                  return dc.lineChart(c)
                    .curve(d3.curveCardinal.tension(0.5))
                    .renderDataPoints({radius: 4})
                    .evadeDomainFilter(true)
                })
                .width(seriesChartWidth-self.legendSize)
                .height(seriesChartHeight)
                .margins({top: 10, right: 15, bottom: 30, left: 50})
                .dimension(loiNameYearDim)
                .group(snapToZero(areaByloiNameYear))
                .seriesAccessor(function(d:any) { 
                    return d.key[0]; // connect with legend
                }) 
                .keyAccessor(function(d:any) { 
                  return d.key[1]; // connect with x axis
                }) 
                .valueAccessor(function(d:any) {
                  return d.value; // connect with y axis
                })
                .ordinalColors(seriesColors)
                .title(function(d:any) {
                  let formater=DeforestationOptionsUtils.numberFormat(self.lang);
                  return  self.loiNames[d.key[0]] + "\n" +
                          d.key[1] + "\n" +
                          formater(d.value) + " km²";
                })
                .yAxisPadding('15%')
                .elasticY(true)
                .elasticX(false)
                .yAxisLabel(this.labelArea)
                .x(xScale)
                .mouseZoomable(false)
                .renderHorizontalGridLines(true)
                .renderVerticalGridLines(true)
                .legend(dc.legend().x(seriesChartWidth-self.legendSize).y(10).gap(5).legendText(function(d:any) {
                  return self.loiNames[d.name];
                }))
                .brushOn(false);

    this.seriesChart.data(function (group:any) {
                  Terrabrasilis.enableLoading("#series-chart");
                  var aux:any = []; 
                  // filter by years from composite bar chart
                  if (!self.area.hasFilter()) {                    
                    self.areaByDate.top(Infinity).forEach(function(element:any) {
                      aux = aux.concat(group.top(Infinity)
                                .filter(function(loiname:any){ 
                                  return loiname.key[1] == element.key
                                })
                                .map(function(loiname:any){ 
                                  return loiname;
                                })
                            )
                    });
                  } else {
                    self.area.filters().forEach(function(element:any) {
                      aux = aux.concat(group.top(Infinity)
                                .filter(function(loiname:any){ 
                                  return loiname.key[1] == element
                                })
                                .map(function(loiname:any){ 
                                  return loiname;
                                })
                            )
                    })
                  }
                  
                  var result:any = []
                  if (!self.rowChart.hasFilter()) {                    
                    self.areaByLoiName.top(self.maxLoi).forEach(function(element:any) { 
                      result = result.concat(aux
                                .filter(function(loiname:any){ 
                                  return loiname.key[0] == element.key
                                })
                                .map(function(loiname:any){ 
                                  return loiname;
                                })
                            )
                    })
                  } else {
                    self.rowChart.filters().forEach(function(element:any) { 
                      result = result.concat(aux
                                .filter(function(loiname:any){ 
                                  return loiname.key[0] == element
                                })
                                .map(function(loiname:any){ 
                                  return loiname;
                                })
                            )
                    })
                  }
                  
                  return result;
                });
    
    // erase black filling
    this.seriesChart.on('renderlet', function (chart:any) {
      d3.selectAll('.line').style('fill', 'none');
      Terrabrasilis.disableLoading("#series-chart");
    });

    this.seriesChart.xAxis().ticks(auxYears.length);
    
    this.seriesChart.xAxis().tickFormat(function(d:any) {
			return d+"";
    });
    
		this.seriesChart.addFilterHandler(function(filters:any, filter:any) {
			filters.push(filter);
			return filters;
    });

    this.seriesChart.on("renderlet.a",function (chart:any) {
      // rotate x-axis labels
      chart.selectAll('g.x text')
        .attr('transform', 'translate(-10,10) rotate(315)');
      $("#series-chart > svg").attr("width", seriesChartWidth);
    });
    
		// add one graph
    this.listCharts.set('series-chart', this.seriesChart);
    
    // add one graph
    var rowChartWidth = $('#row-chart')[0].offsetWidth;
    var rowChartHeight = $('#row-chart')[0].offsetHeight;
            
    this.rowChart.width(rowChartWidth)
            .height(rowChartHeight)
            .margins({top: 10, right: 10, bottom: 20, left: 15})
            .elasticX(true)
            .dimension(this.loiNameDim)
            .group(this.areaByLoiName)            
            .controlsUseVisibility(true)
            .title(function(d:any) {
              let formater=DeforestationOptionsUtils.numberFormat(self.lang);
              return self.loiNames[d.key] + ' : ' + formater(d.value) + " km²";
            })
            .label(function(d:any) {
              
              // ordered array
              var array = self.areaByLoiName.top(Infinity);
              var order = array.sort(
                function(a:any, b:any) {
                  return b.value - a.value;
                }
              );

              // get index 
            var index = order.findIndex(
              function(loiname:any) {
                return loiname.key == d.key
              }
            );

            let formater=DeforestationOptionsUtils.numberFormat(self.lang);

            var sum:any = array.map((ele:any) => { return ele.value; }).reduce(function(acc:any, ele:any) { return acc + ele; }, 0);

            return (index+1)+"° - "+self.loiNames[d.key] + ' : ' + formater(d.value) + " km² - ("+((100*(+d.value/sum)).toFixed(2))+"%)";
              
            })
            .ordering(function(d:any) { return -d.value })
            .colors(['#bde397'])
            .labelOffsetY(10)
            .xAxis()
            .ticks(4);

    if(Object.keys(self.loiNames).length==1){
      this.rowChart.fixedBarHeight(20);
    }
    
    this.rowChart.xAxis().tickFormat(function(d:any) {return d+"km2";});
    
    this.rowChart.data(function (group:any) {
      Terrabrasilis.enableLoading("#row-chart");
      Terrabrasilis.enableLoading("#loi-chart");
      return group.top(self.maxLoi);
    });

    this.rowChart.on('renderlet', function () {      
      Terrabrasilis.disableLoading("#row-chart");
    });

    this.rowChart.on('filtered', function(chart:any) {
      if (!chart.hasFilter()) {
        self.applyCountyFilter(null);// to reset the data funcion
      }

      self.loiname = self.translatedLoiname;
      self.cdRef.detectChanges();
    });

    this.rowChart.filterPrinter(function(filters:any) {

      self.loiname = "[";
      var first = 1;
      filters.forEach(function(f:any) {
        if (first) {
          self.loiname = self.loiname.concat(self.loiNames[f]);
          first = 0;
        } else {
          self.loiname = self.loiname.concat(", ", self.loiNames[f]);
        }
      });
      self.loiname = self.loiname + "]";
      self.cdRef.detectChanges();
    });

    // render chart   
    this.listCharts.set('row-chart', this.rowChart);

    $('#reset_filter').click(()=>{self.resetFilters(self);});

    (function(j, dc){
      setTimeout(() => {
        dc.renderAll();
      },100 * j);
    })(1, dc);

    dc.renderlet(function() {

      // cancel old call that no run yet
      clearTimeout(redrawMap.ctrlTimeout);
       (function(j, redrawMap, scope){
         redrawMap.ctrlTimeout=setTimeout(() => {
           redrawMap.call(scope.mapJson, scope.areaByLoiName, scope.rowChart.filters());
         },100 * j);
       })(10, redrawMap, self);

      // cancel old call to render table
      clearTimeout(self.ctrlTableTimeOut);
      (function(j, scope){
        scope.ctrlTableTimeOut=setTimeout(() => {
          scope.tableArea.render();
        },100 * j);
      })(10, self);
      
    });

    // initial window settings
    var h = $(window).height(), w = $(window).width();

    // when window resize
    $(window).resize(function() {

      if(self.ctrlSto) clearTimeout(self.ctrlSto);
      self.ctrlSto=setTimeout(() => {
        
        // update window size
        var nh = $(window).height(), nw = $(window).width();
        // compare previous and new window size
        if (!(nh == h && nw == w)) {
          h = nh;
          w = nw;
          self.updateSizeCharts(transition);
        }
      }, 500);
      
      self.tagId = $(".ui-resizable-resizing > .grid-stack-item-content > div:nth-child(2)").attr("id");
    });
    
    $('#main-grid').on('resizestop', function (event:any, ui:any) {

      if(self.ctrlSto) clearTimeout(self.ctrlSto);
      self.ctrlSto=setTimeout(() => {
        DeforestationOptionsUtils.render(self.tagId, self.listCharts, transition, self.loiNames, self.selectedLoi, self.type);
      }, 300);
    });

    $('#sidebarCollapse').on('click', function(){setTimeout(() => {self.updateSizeCharts(transition);}, 300);});

    this.updateGridstackLanguage();

    // check whether rates
    if(this.type == "rates") {
      $('[id="1"]').closest('li').hide();
      $('[id="2"]').closest('li').hide();
      $('[id="3"]').closest('li').hide();
      $('[id="tools-menu"]').hide();
    } else {
      $('[id="1"]').closest('li').show();
      $('[id="2"]').closest('li').show();
      $('[id="3"]').closest('li').show(); 
      $('[id="tools-menu"]').show();
    }
      
  }

  resetFilters(context:any) {

    if(!context) return;

    context.barChart.filterAll();
    context.rowChart.filterAll();
    context.applyCountyFilter();// to reset function data() of the rowChart
    context.seriesChart.filterAll();

    dc.redrawAll();
  }

  updateSizeCharts(transition:any) {
    let self = this;
    let arrKeys = Array.from(self.listCharts.keys());
    for (let item of arrKeys) {
      DeforestationOptionsUtils.render(item, self.listCharts, transition, self.loiNames, self.selectedLoi, self.type);
    }
    setTimeout(() => {
      // define the height for div content using the div identifier: "myTabContent"
      // (sub-bar + filters-bar + header + footer)
      let h = $(window).height() - ($('#sub-bar-options').height() + $('#title-chart').height() + $('#content').height() + $('.footer').height());
      $('#myTabContent').height( h );
    }, 500);
  }

  changeLanguage(value:string) {
    this.lang=value;
    this.last_update_date=(new Date(Constants.LAST_UPDATE_DATE)).toLocaleDateString(this.lang);
    this.localStorageService.setValue(this.languageKey, value);
    this._translate.use(value);
    this.updateGridstackLanguage();
    dc.renderAll();

    notifyLanguageChanged(value);  

  }

  updateGridstackLanguage():void {

    forkJoin([(this.type == "rates")?(this._translate.get('dashboard.graph.aggregateTemporalRates')):(this._translate.get('dashboard.graph.aggregateTemporalIncrements')),
              (this.type == "rates")?(this._translate.get('dashboard.graph.aggregateSpatialRates')):(this._translate.get('dashboard.graph.aggregateSpatialIncrements')),
              (this.type == "rates")?(this._translate.get('dashboard.graph.timeSeriesRates')):(this._translate.get('dashboard.graph.timeSeriesIncrements')),
              (this.type == "rates")?(this._translate.get('dashboard.graph.absoluteDataRates')):(this._translate.get('dashboard.graph.absoluteDataIncrements')),
              (this.type == "rates")?(this._translate.get('dashboard.graph.tableLois.titleRates')):(this._translate.get('dashboard.graph.tableLois.titleIncrements')),
              this._translate.get('dashboard.graph.label.area'),
              this._translate.get('dashboard.graph.label.taxa'),
              //this._translate.get('dashboard.graph.label.monitoring', {biome: this.biome.charAt(0).toUpperCase()+this.biome.slice(1).replace("_", " "), minDate: this.minDate, maxDate: this.maxDate}),
              this._translate.get('dashboard.graph.label.regularArea'),
              this._translate.get('dashboard.graph.label.filteredArea'),
              this._translate.get('dashboard.loi.uf'),
              this._translate.get('dashboard.loi.mun'),
              this._translate.get('dashboard.loi.consunit'),              
              this._translate.get('dashboard.loi.indi'),
              this._translate.get('dashboard.graph.'+this.biome),
              this._translate.get('dashboard.loi.'+this.selectedLoi)
            ]).subscribe((data) => {
                $('.aggregateTemporal').text(data[0]+" - "+data[13]+" - "+data[14]);
                $('.aggregateSpatial').text(data[1]+" - "+data[13]+" - "+data[14]);
                $('.timeSeries').text(data[2]+" - "+data[13]+" - "+data[14]);
                $('.absoluteData').text(data[3]+" - "+data[13]+" - "+data[14]);
                $('.tableLois').text(data[4]+" - "+data[13]+" - "+data[14]);
                this.labelArea = data[5];
                this.labelRates = data[6];
                this.labelRegularArea = data[7];
                this.labelFilteredArea = data[8];
                this.barChart.yAxisLabel((this.type == "rates")?(this.labelRates):(this.labelArea));
                this.barChart.render();
                this.seriesChart.yAxisLabel((this.type == "rates")?(this.labelRates):(this.labelArea));
                this.seriesChart.render();
                Terrabrasilis.disableLoading("#loi-chart");
                $('#0').text(data[9]);
                $('#1').text(data[10]);
                $('#2').text(data[11]);
                $('#3').text(data[12]);
              });
    }
  
    showContact() {
      this.cdRef.detectChanges();
      this.dialog.open(ContactComponent, { width : '450px' });
    }

    initAuthentication()
    {

        this.localStorageService.getValue(this.languageKey)
        .subscribe((item:any) => {
            let toUse = JSON.parse(item);
            var lang='pt-br';
            if(toUse!=null)
            {
                lang = toUse.value;
            }
                        
            /**
             * Setting up authentication api
             */
            Authentication.init(lang, function()
            {
                /**
                 * Notify authentication handler about login changes
                 */
            if($('#notifyAuthenticationChanged').length!=0)
            {
                $('#notifyAuthenticationChanged').click();
            }
            });

        });
        
    }
}