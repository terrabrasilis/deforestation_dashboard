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
        let url = Constants.BASE_URL+"/app/prodes/dashboard/deforestation/files/";

        if(process.env.BUILD_TYPE == 'homologation' && process.env.ENV == 'production')
            url = Constants.BASE_URL+"/homologation/prodes/dashboard/deforestation/files/";

        return url;
    };

    public static get AVOID_CACHE(){
        // Used to prevent caching of JSON requests when the application version changes.
        return '?v=' + process.env.VERSION;
        // another approach to prevent caching, but that solution avoid the cache for every.
        // return '?t=' + String(Math.floor((Math.random() * 1000000) + 1));
    }

    public static get FILE_RATES(): string {
        let filename=(process.env.BUILD_TYPE == 'homologation' && process.env.ENV == 'production')?("rates2025_homol.json"):("rates2025.json");
        let url = Constants.DASHBOARD_API_HOST;
        // return the URL and name of JSON file with rates
        return url+filename+Constants.AVOID_CACHE;
    };

    public static get LAST_UPDATE_DATE(): string {
        let filename="last_update_date.json";
        let url = Constants.DASHBOARD_API_HOST;
        // return the URL and name of JSON file with rates
        return url+filename+Constants.AVOID_CACHE;
    };

    public static get DASHBOARD_BIOMES_NAMES(): string[] {
        let listNames: string[] = ["amazon", "amazon_nf", "mata_atlantica", "caatinga", "cerrado", "pampa", "pantanal", "legal_amazon"];
        return listNames;
    };

    /**
     * Used to change the color of the bar and the tooltip of the reference bar when data for a specific year is preliminary data.
     * To disable this behavior and change the notes about the released data, simply return null value.
     */
    public static get BARCHART_PRELIMINARY_DATA_YEAR(): String {
        // enable preliminary notes
        //return '2025';
        // disable preliminary notes
        return null;
    }

    public static get MAP_LEGEND_COLORS(): any[] {
        return ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'];
    }  

    public static get MAP_LEGEND_GRADES(): number {
        return 8;
    };

    public static get DASHBOARD_STATES(): any {
        var map = new Map();
        map.set("cerrado", ['PARÁ', 'MATO GROSSO', 'MARANHÃO', 'PIAUÍ', 'BAHIA', 'RONDÔNIA', 'MATO GROSSO DO SUL', 'GOIÁS', 'MINAS GERAIS', 'SÃO PAULO', 'PARANÁ', 'TOCANTINS', 'DISTRITO FEDERAL']);
        map.set("amazon", ['PARÁ', 'AMAZONAS', 'RORAIMA', 'ACRE', 'MATO GROSSO', 'RONDÔNIA', 'AMAPÁ', 'MARANHÃO', 'TOCANTINS']);
        map.set("amazon_nf", ['PARÁ', 'AMAZONAS', 'RORAIMA', 'ACRE', 'MATO GROSSO', 'RONDÔNIA', 'AMAPÁ', 'MARANHÃO', 'TOCANTINS']);
        map.set("legal_amazon", ['PARÁ', 'AMAZONAS', 'RORAIMA', 'ACRE', 'MATO GROSSO', 'RONDÔNIA', 'AMAPÁ', 'MARANHÃO', 'TOCANTINS']);
        map.set("pampa", ["RIO GRANDE DO SUL"]);
        map.set("pantanal", ['MATO GROSSO DO SUL', 'MATO GROSSO']);
        map.set("mata_atlantica", ['ALAGOAS', 'PARANÁ', 'SANTA CATARINA', 'MATO GROSSO DO SUL', 'SERGIPE', 'RIO GRANDE DO SUL', 'RIO DE JANEIRO', 'MINAS GERAIS', 'RIO GRANDE DO NORTE', 'DISTRITO FEDERAL', 'PARAÍBA', 'PERNAMBUCO', 'BAHIA', 'GOIÁS', 'SÃO PAULO', 'ESPÍRITO SANTO']);
        map.set("caatinga", ['PIAUÍ', 'ALAGOAS', 'SERGIPE', 'MINAS GERAIS', 'RIO GRANDE DO NORTE', 'PARAÍBA', 'PERNAMBUCO', 'BAHIA', 'CEARÁ', 'MARANHÃO']);
        return map;
    };

    /**
     * Relates the two first digits of the IBGE code (codibge) of a municipality to its state.
     * The state names use the same spelling of DASHBOARD_STATES, so the values can be compared
     * with the state checkboxes of the download modal.
     */
    public static get DASHBOARD_UF_CODES(): any {
        var map = new Map();
        map.set("11", 'RONDÔNIA');
        map.set("12", 'ACRE');
        map.set("13", 'AMAZONAS');
        map.set("14", 'RORAIMA');
        map.set("15", 'PARÁ');
        map.set("16", 'AMAPÁ');
        map.set("17", 'TOCANTINS');
        map.set("21", 'MARANHÃO');
        map.set("22", 'PIAUÍ');
        map.set("23", 'CEARÁ');
        map.set("24", 'RIO GRANDE DO NORTE');
        map.set("25", 'PARAÍBA');
        map.set("26", 'PERNAMBUCO');
        map.set("27", 'ALAGOAS');
        map.set("28", 'SERGIPE');
        map.set("29", 'BAHIA');
        map.set("31", 'MINAS GERAIS');
        map.set("32", 'ESPÍRITO SANTO');
        map.set("33", 'RIO DE JANEIRO');
        map.set("35", 'SÃO PAULO');
        map.set("41", 'PARANÁ');
        map.set("42", 'SANTA CATARINA');
        map.set("43", 'RIO GRANDE DO SUL');
        map.set("50", 'MATO GROSSO DO SUL');
        map.set("51", 'MATO GROSSO');
        map.set("52", 'GOIÁS');
        map.set("53", 'DISTRITO FEDERAL');
        return map;
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
