/**
 * This class is responsible to expose auxiliary functions within deforestation options code
 */    

import * as Terrabrasilis from "terrabrasilis-api";
import { Constants } from './constants';
import * as dc from "dc";
import * as d3 from "d3";

export class DeforestationOptionsUtils {

  /**
   * Relate the municipality names with the selected states
   * @param loi The municipality list from redis-api
   * @param loinames A map to relate the gid of municipalities and all municipalities of selected states (output)
   * @param checkedLoiNames The list of selected states in UI. The state list gettered from constants.ts
   * @returns null
   */
  public static setLoiNamesDownload(loi:any, loinames:any, checkedLoiNames:any) {
        
    loi.loinames.forEach(function(loiname:any) {
      var [mun, state] = loiname.loiname.split("_");
      if (checkedLoiNames.indexOf(state.toUpperCase()) > -1)
        loinames[loiname.gid] = [mun, state, loiname.codibge];
    });

    return;

  }

  public static setLoiNames(loi:any, self:any) {
    
    loi.loinames.forEach(function(loiname:any) {  
      self.loiNames[loiname.gid] = loiname.loiname;
      self.loiNamesObject.push({key:loiname.gid,value:loiname.loiname});
    });

  }

  public static setLoiNamesSplit(loi:any, self:any) {
    
    loi.loinames.forEach(function(loiname:any) {  
      var value = loiname.loiname.split("_")[0];
      self.loiNames[loiname.gid] = value;
      self.loiGeocodes[loiname.gid] = loiname.codibge;
      self.loiNamesObject.push({key:loiname.gid,value:value});
    });

  }

  public static dataWranglingRates(dataJson:any) {
    
    var all:any[] = [];

    dataJson["periods"].forEach(function(period:any) {
      period.features.forEach(function(feature:any) {       
        var year = period.endDate.year;
        var area = feature.areas.filter((area:any) => area.type == 1).map(function(e:any) { return e.area; })[0];
        all.push({ 
          endDate: year,
          loi: feature.loi,
          loiName: feature.loiname,
          area: area
        });
      });
    });
        
    return all;
  }

  public static dataWranglingIncrements(dataJson:any, oSelectedLoi:any, includeMask:boolean) {

    var all:any[] = [];
    var mask:any[] = [];

    var divideAreaByYear=function(startY:any, endY:any, oSelectedLoi:any, feature:any, aData:any[]){
      var isMask = startY==1500;
      // to avoid the area division of mask, force to 1
      var difYears = (isMask) ? (1) : (parseInt(endY) - parseInt(startY));
      var area = feature.areas[0].area;
      var maskArea = mask[feature.loi]&&mask[feature.loi][feature.loiname] ? mask[feature.loi][feature.loiname] : 0;

      var areaTotal = includeMask ?  maskArea : 0;
      var currentYear = isMask ? endY : startY+1;

      if(includeMask || !isMask) {
        while(currentYear<=endY) {
          areaTotal = isMask ? areaTotal : ( (area*(1/difYears)) + areaTotal );
          if(includeMask){
            if(!mask[feature.loi]) {
              mask[feature.loi]={};
            }
            if(!mask[feature.loi][feature.loiname]) {
              mask[feature.loi][feature.loiname]={};
            }
            mask[feature.loi][feature.loiname] = areaTotal;
          }
          var d={
            endDate: currentYear,
            loi: feature.loi,
            loiName: feature.loiname,
            area: areaTotal
          };
          aData.push(d);
          currentYear=currentYear+1;
          if(!includeMask) areaTotal=0;
        }
      }
    };

    var storeMask=function(feature:any, aData:any[]){
      var area = feature.areas[0].area;
      var d=[];
      d[feature.loiname]=area;
      if(typeof aData[feature.loi] == 'undefined'){
        aData[feature.loi]=[];
      }
      aData[feature.loi][feature.loiname]=area;
    };

    dataJson["periods"].forEach(function(period:any) {
      var startYear = period.startDate.year;
      var endYear = period.endDate.year;

      // insert lois from default list if not exists in period loi list
      let oDefault={areas:[{type: 1, area: 0}],loiname:'',loi:oSelectedLoi.gid};
      oSelectedLoi.loinames.forEach( (e:any)=>{
        let oFind=period.features.filter((a:any)=>{
          return a.loi==oSelectedLoi.gid && e.gid==a.loiname;
        }).map((i:any)=>{
          return i;
        });
        if(!oFind){
          oDefault.loiname=e.gid;
          period.features.push(oDefault);
        }
      });

      period.features.forEach(function(feature:any) {
        if(feature.loi!=oSelectedLoi.gid) return;
        /*
         * The magic number for startY=1500 is a convention to the start year for deforestation mask
         * In this case, we store the mask to use after prepare areas by lois and years
         */
        if(includeMask && startYear==1500) {
          storeMask(feature,mask);
        }
        divideAreaByYear(startYear,endYear,oSelectedLoi,feature,all);
      });
    });

    /*
    // ids de lois que não aparecem em 2001 pantanal (10887, 10888, 10889, 10893)
    var areall=0; var ids=[];
    allf.forEach(
      (f)=>{
        if(!ids[f.endDate]) {ids[f.endDate]=[];}
        if(!ids[f.endDate].includes(f.loiName)) {
          ids[f.endDate].push(f.loiName);
        }
        if(f.endDate==2021) areall+=f.area;
      });
    */

    return all;
  }
    
  public static getloiNamesByLoi(arr:any, loi:any):Array<number> {      
    
    return arr.filter(
      (filteredloi:any) => { 
        return filteredloi.loi === loi
      }
    )
    .map(
      (e:any) => { 
        return {"key":e["gid"], "value":e["loiname"]};
      }
    );

  };

  public static style(feature:any) {
      
      return {
          fillColor: Terrabrasilis.getColor(feature.properties.density),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
  
  };

  public static numberFormat(lang:string='pt-br') {

    let pt_br:d3.FormatLocaleDefinition={
      "decimal": ",",
      "thousands": ".",
      "grouping": [3],
      "currency": ["R$", ""]
    };

    let en:d3.FormatLocaleDefinition={
      "decimal": ".",
      "thousands": ",",
      "grouping": [3],
      "currency": ["$", ""]
    };

    let locales={
      "pt-br":pt_br,
      'en':en
    };
    
    return d3.formatDefaultLocale(locales[lang]).format(',.2f');
  };

  public static dateFormat() {
    let localeDate:d3.TimeLocaleDefinition={
      "dateTime": "%d/%m/%Y %H:%M:%S",
      "date": "%d/%m/%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      "shortDays": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    };
    return d3.timeFormatDefaultLocale(localeDate);
  }

  // format Number
  public static formatTitle(num:number) {
    
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }        

    return (num).toFixed(1).replace(/\.0$/, '');

  };

  public static get MAP_LEGEND_GRADES(): number {
      return 8;
  };    

  public static renderGraph(id:any, listCharts:any, transition:any, loiNames:any, loi:any, type: any):void {
    
    var width = $('#'+id).width(); // get width from parent div
    var height = $('#'+id).height(); // get height from parent div
  
    var result = listCharts.get(id); // get result from list charts
        
    if (id == "bar-chart") {
        result.width(width+10) // update width
              .height(height) // update height
              .transitionDuration(transition); // update transitions

        result.x(d3.scaleBand().rangeRound([0, width]).paddingInner(0.05))
              .xUnits(dc.units.ordinal);  

        // if (type != "rates")         
        //   result.legend(dc.legend().x(width-barChartLegend).y(5).itemHeight(13).gap(4).legendText(function(d:any) { return d.name; }));        

        result.on("renderlet.a",function (chart:any) {
          // rotate x-axis labels
          chart.selectAll('g.x text')
            .attr('transform', 'translate(-10,10) rotate(315)');
          $("#bar-chart > svg").attr("width", width);
        });

    } else if (id == "series-chart") {

      var seriesChartLegend = Constants.DASHBOARD_LEGEND_WIDTH_SERIES_CHART.get(loi);
      
      result.width(width-seriesChartLegend) // update width
            .height(height) // update height
            .transitionDuration(transition); // update transitions
      
      result.legend(dc.legend().x(width-seriesChartLegend).y(10).itemHeight(13).gap(5).legendText(function(d:any) { 
        return loiNames[d.name];
      }));

      result.on("renderlet.a",function (chart:any) {
        // rotate x-axis labels
        chart.selectAll('g.x text')
          .attr('transform', 'translate(-10,10) rotate(315)');
        $("#series-chart > svg").attr("width", width);
      });

    }
    else if (id == "row-chart") {
        result.width(width*.95) // update width
        .height(height*.95) // update height
        .transitionDuration(transition); // update transitions

        $('.search-loi').width(0.8*width);
    }

    (function(j, result){
      setTimeout(() => {
        result.render();  
        Terrabrasilis.disableLoading(id);               
        Terrabrasilis.disableLoading("#loi-chart");      
      },100 * j);
    })(2, result);    

  }

  public static renderMap():void {
    Terrabrasilis.enableInvalidateSize();
    
  }

  public static render(item:any, listCharts:any, transition:any, loiNames:any, loi:any, type:any):void {
    if (item != "loi-chart")        
      this.renderGraph(item, listCharts, transition, loiNames, loi, type);
    else
      this.renderMap();
  }
    
}