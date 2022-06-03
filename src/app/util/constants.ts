/**
 * This class is responsible to store all global variables to use in entire application and not duplicate code
 */
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export class Constants {

    constructor(@Inject(DOCUMENT) private document: Document) { }

    public static get BASE_URL(): string {
        return document.location.protocol+'//'+document.location.hostname;
    };

    public static get DASHBOARD_API_HOST(): string {
        let url=Constants.BASE_URL+"/dashboard/api/v1/redis-cli/";

        if(process.env.LOCAL_API == 'yes')
            url = Constants.BASE_URL+":3000/dashboard/api/v1/redis-cli/";

        if(process.env.BUILD_TYPE == 'homologation' && process.env.ENV == 'production')
            url = Constants.BASE_URL+"/homologation/dashboard/api/v1/redis-cli/";

        return url;
    };

    public static get FILE_RATES(): string {
        // return the name of JSON file with rates
        return "assets/files/rates2021.json";
    };

    public static get LAST_UPDATE_DATE(): string {
        return "2022-06-03";
    };

    public static get DASHBOARD_BIOMES_NAMES(): string[] {
        let listNames: string[] = ["amazon", "atlantic", "caatinga", "cerrado", "pampa", "pantanal", "legal_amazon"];
        return listNames;
    };

    /**
     * Used to change the color of the bar and the tooltip of the reference bar when data for a specific year is preliminary data.
     * To disable this behavior and change the notes about the released data, simply return null value.
     */
    public static get BARCHART_PRELIMINARY_DATA_YEAR(): String {
        // enable preliminary notes
        //return '2021';
        // disable preliminary notes
        return null;
    }

    public static get MAP_LEGEND_COLORS(): any[] {
        return ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'];
    }  

    public static get MAP_LEGEND_GRADES(): number {
        return 8;
    };  
    
    public static get DASHBOARD_CERRADO_STATES(): any[] {
        return ['MATO GROSSO', 'MARANHÃO', 'PIAUÍ', 'BAHIA', 'RONDÔNIA', 'MATO GROSSO DO SUL', 'GOIÁS', 'MINAS GERAIS', 'SÃO PAULO', 'PARANÁ', 'TOCANTINS', 'DISTRITO FEDERAL'];
    };  

    public static get DASHBOARD_AMAZON_STATES(): any[] {
        return ['PARÁ', 'AMAZONAS', 'RORAIMA', 'ACRE', 'MATO GROSSO', 'RONDÔNIA', 'AMAPÁ', 'MARANHÃO', 'TOCANTINS'];
    };  

    public static get DASHBOARD_LEGAL_AMAZON_STATES(): any[] {
        return ['PARÁ', 'AMAZONAS', 'RORAIMA', 'ACRE', 'MATO GROSSO', 'RONDÔNIA', 'AMAPÁ', 'MARANHÃO', 'TOCANTINS'];
    };  

    public static get DASHBOARD_LEGEND_WIDTH_SERIES_CHART(): any {
        var map = new Map();
        map.set("uf", 140);
        map.set("mun", 210);
        map.set("consunit", 350);
        map.set("indi", 200);
        return map;
    };
}
