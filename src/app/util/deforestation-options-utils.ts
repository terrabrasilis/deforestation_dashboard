/**
 * This class is responsible to expose auxiliary functions within deforestation options code
 */    

import * as Terrabrasilis from "terrabrasilis-api";
import { Constants } from './constants';
import * as dc from "dc";
import * as d3 from "d3";

export class DeforestationOptionsUtils {

  public static setLoiNamesDownload(loi:any, loinames:any, checkedLoiNames:any) {
        
    loi.loinames.forEach(function(loiname:any) {
      var [mun, state] = loiname.loiname.split("_");
      if (checkedLoiNames.indexOf(state) > -1)
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

  public static dataWranglingIncrements(dataJson:any, biome:any) {

    var all:any[] = [];

    var divideAreaByYear=function(startY:any, endY:any, feature:any, aData:any[]){
      var difYears = parseInt(endY) - parseInt(startY);
      /* It is used to disable the long aggregate periods called the deforestation mask.
       * To enable the mask, comment this line.
       */
      if(difYears>2) return;

      var area = feature.areas.filter((area:any) => area.type == 1).map(function(e:any) { return e.area; })[0];
      var currentYear = startY+1;
      while(currentYear<=endY) {
        var d={
          endDate: currentYear,
          loi: feature.loi,
          loiName: feature.loiname,
          area: area*(1/difYears)
        };
        aData.push(d);
        currentYear=currentYear+1;
      }
    };

    dataJson["periods"].forEach(function(period:any) {
      period.features.forEach(function(feature:any) {
        var startYear = period.startDate.year;
        var endYear = period.endDate.year;
        divideAreaByYear(startYear,endYear,feature,all);
      });
    });

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