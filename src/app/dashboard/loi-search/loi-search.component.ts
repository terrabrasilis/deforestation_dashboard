import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DashboardLoiSearchService } from '../../services/dashboard-loi-search.service';
import { DeforestationOptionsComponent } from '../deforestation/deforestation-options/deforestation-options.component';

/* Translate */
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-loi-search',
  templateUrl: './loi-search.component.html',
  styleUrls: ['./loi-search.component.css'],
  providers: [ DashboardLoiSearchService ]
})

export class LoiSearchComponent implements OnInit {

  results: Array<{key:any,value:any}>=new Array();
  panelReference: DeforestationOptionsComponent;
  priorityCities: Array<{key:any,value:any}>=new Array();
  selectedKeys: Set<number> = new Set<number>();
    

  /* Variável que recebe o valor da função handleFilterChange */
  private filterString: Subject<string> = new Subject<string>();
  private searchSubscription: any;
  private loi:any;
  private languageKey: string = "translate";
  public prioritiesCities: boolean;
  searchTerm: string;
  private selectAll: boolean = false;
  private maxSelection: number;
  
  constructor(private deforestationOptionsComponent: DeforestationOptionsComponent,
    private searchService: DashboardLoiSearchService,
    private _translate: TranslateService,    
    private localStorageService: LocalStorageService)
    {
      this.maxSelection=200;

    this.panelReference=deforestationOptionsComponent;

    deforestationOptionsComponent.loiSearchComponent = this;    

    this.prioritiesCities = false;

    this.selectedKeys=new Set<number>();
  }

  switchPrioritiesCities()
  {
    if(this.prioritiesCities)
    {
      this.prioritiesCities = false;  
    }
    else
    {
      this.prioritiesCities = true;
    }
    this.resetActives();

    this.handleFilterChange(this.searchTerm);
  }

  
  /**
   * Called when new term is typed.
   * Term is putting into Subject.
   * The result is cleaned. 
   * In first time we subscribe the search service.
   * 
   * @param term The typed term.
   */
  handleFilterChange(term: string) 
  {
    this.searchTerm = term;
    this.results=new Array();
    let results=new Array();
      
    results = this.searchSubscription=this.searchService.searchEntries(term);
    
    if(this.panelReference.selectedLoi=='mun' && this.prioritiesCities && this.panelReference.biome == 'legal_amazon')
    {
      this.getPrioritiesCities(results).then((prioritiesCitiesResults: Array<{key:any,value:any}>)=>
      {
        this.results = prioritiesCitiesResults;      
      });
    }
    else
    {
      this.results = results;      
    }
    
  }
  
  ngOnInit() 
  { 
    
  }

  /**
   * 
   * @param key The selected item on the list of found LOIs
   */
  selectLoi(key:number) {    
    
    if(this.isSelected(key)==false)
    {      
      this.selectedKeys.add(key);
    }
    else
    {
      this.selectedKeys.delete(key);
    }
    this.checkMaximumLoisSelected();
  }

  resetActives() 
  {    
    this.results.forEach(
      (item) => {
        $('#'+item.key+'_item').removeClass('active');
      }
    );
    this.checkMaximumLoisSelected();
  }

  evaluateActives(actives:Array<any>) {
    this.resetActives();
    actives.forEach(
      (item) => {
        $('#'+item.key+'_item').addClass('active');
      }
    );
  }

  isSelected(id: number)
  {
    if(this.selectedKeys.has(id))
    {
      return true;
    }
    return false;
  }

  updateLoi() {
    let oldTerm=$('#search-county').val();
    $('#search-county').val('');
    $('#search-county').val(oldTerm);

    if(this.loi != this.panelReference.selectedLoi)
    {
      this.selectedKeys = new Set<number>();      
      this.panelReference.rowChart.filterAll();
      this.results=new Array();
    }else{
      let selectedFilters=this.panelReference.rowChart.filters();
      let highlight: Array<{key:any,value:any}>=new Array();
      for(let i=0;i<this.results.length;i++) {
        if( selectedFilters.includes(this.results[i].key) ) {
          highlight.push(this.results[i]);
        }
      }
    }
    this.loi = this.panelReference.selectedLoi;
    this.searchTerm="";
    this.handleFilterChange(this.searchTerm);
  }



  changeLanguage(value:string) {
    this.localStorageService.setValue(this.languageKey, value);      
    this._translate.use(value);    
  }

  getPrioritiesCities(currentResult: Array<{key:any,value:any}>) : Promise<Array<{key:any,value:any}>>
  {
    let promise = new Promise<Array<{key:any,value:any}>>((resolve, reject) => {
      let results=new Array<{key:any,value:any}>();
      if(this.panelReference.selectedLoi=='mun' && this.panelReference.biome == 'legal_amazon')
      {      
        let prioritiesCitiesResults = new Array<{key:any,value:any}>();
        let oSelectedLoi=this.panelReference.dataLoinamesJson.lois.find((l:any)=>{return l.name==this.panelReference.selectedLoi;});
  
        this.searchService.getPrioritiesCities()
            .subscribe(data => {
              if(data['features'] && data['features'].length>0)
              {
                
                if(data['features'][0].properties &&
                data['features'][0].properties.year &&
                data['features'][0].properties.codes)
                {
                  let codesStr = data['features'][0].properties.codes.split(',');
    
                  //Locate loi gid by codibge
                  for (let i = 0; i < oSelectedLoi.loinames.length; i++) 
                  {
                    const loiname = oSelectedLoi.loinames[i];
    
                    codesStr.forEach((cityCode: string) =>
                    {
                      if(loiname.codibge == Number.parseInt(cityCode))
                      {      
                        //codes.push(loiname.gid);
                        for (let j = 0; j < currentResult.length; j++) 
                        {
                          if(loiname.gid == currentResult[j].key)
                          {
                            prioritiesCitiesResults.push(currentResult[j]);
                            break;
                          }
                        }
                        
                      }                  
                    });                  
                  }
                  
                  results=prioritiesCitiesResults.sort(function(a:any, b:any) {
                    return ('' + a.value).localeCompare(b.value);
                  });
                  resolve(results);
                }
              }
              
            });
      }
    });
    
    return promise;
  }
  apply()
  {
    let selected = Array.from(this.selectedKeys.values());
    
    if(selected.length>0)
    {
      if(selected.length<=this.maxSelection)
      {
        this.panelReference.resetFilters(this.panelReference);
        this.panelReference.filterByLois(selected);
      }
      else
      {
        this._translate.get("dashboard.search.loisLimitError").subscribe((text) => {
          
          text=text.replace('%s', selected.length);
          text=text.replace('%m', this.maxSelection);          
          
        });
        
      }    
    }
    else
    {
      this.panelReference.resetFilters(this.panelReference);
    }
    
  }

  checkMaximumLoisSelected()
  {
    let selected = Array.from(this.selectedKeys.values());
    

    if(selected.length<=this.maxSelection)
    {
      $('#apply-button').removeAttr('disabled');
      $('#loi-search-error-div').hide();        
    }
    else
    {        
      $('#apply-button').attr('disabled', 'disabled');
      $('#loi-search-error-div').show();

      this._translate.get("dashboard.search.loisLimitError").subscribe((text) => {
        
        text=text.replace('%s', selected.length);
        text=text.replace('%m', this.maxSelection);          
        $('#loi-search-error-div').html(text);
        
      });
    }    

  }
  toogleSelectAll()
  {
    if(this.selectAll)
    {
      this.selectAll = false;
      this.selectedKeys = new Set<number>();      
    }
    else
    {
      this.selectAll = true;
      this.selectedKeys = new Set<number>();      
      this.results.forEach(
        (item) => {
          this.selectedKeys.add(item.key);
        }
      );
    }
    this.checkMaximumLoisSelected();
  }

  getSearchService()
  {
    return this.searchService;
  }

}
