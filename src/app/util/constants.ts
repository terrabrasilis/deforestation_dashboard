/**
 * This class is responsible to store all global variables to use in entire application and not duplicate code
 */
export class Constants {

    public static get PROXY_OGC(): string { 
        return "http://terrabrasilis.dpi.inpe.br/proxy?url="; 
    };

    public static get DASHBOARD_API_HOST(): string {
        let url="http://terrabrasilis.dpi.inpe.br/dashboard/api/v1/redis-cli/";

        if(process.env.BUILD_TYPE && process.env.ENV == 'production') {
            // confirm the 13111 port in docker-stacks/api/business-api-homologation.yaml
            if(process.env.BUILD_TYPE == 'homologation') url = "http://terrabrasilis2.dpi.inpe.br:30026/dashboard/api/v1/redis-cli/";
            
            // confirm the 2222 port in docker-stacks/demo/docker-compose.yaml
            if(process.env.BUILD_TYPE == 'compose') url = "http://localhost:3333/api/v1/redis-cli/";
        }
        return url;
    };

    public static get DASHBOARD_BIOMES_NAMES(): string[] {
        let listNames: string[] = ["amazon", "atlantic", "caatinga", "cerrado", "pampa", "pantanal", "legal_amazon"];
        return listNames;
    };

    public static get DASHBOARD_CERRADO_DUPLICATED_YEARS(): number[] {
        let duplicatedYears: number[] = [2002, 2004, 2006, 2008, 2010, 2012];
        return duplicatedYears;
    };        

    public static get DASHBOARD_CERRADO_MAINTAINABLE_YEARS(): number[] {
        let maitanableYears: number[] = [2013, 2014, 2015, 2016, 2017, 2018];
        return maitanableYears;
    };

    public static get MAP_LEGEND_COLORS(): any[] {
        return ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'];
    }

    public static get TERRABRASILIS_API_HOST(): string {
        return "http://terrabrasilis.dpi.inpe.br/terrabrasilis/api/v1/";
    };    

    public static get MAP_LEGEND_GRADES(): number {
        return 8;
    };  
    
    public static get DASHBOARD_CERRADO_STATES(): any[] {
        return ['MATO GROSSO', 'MARANHÃO', 'PIAUÍ', 'BAHIA', 'MATO GROSSO DO SUL', 'GOIÁS', 'MINAS GERAIS', 'SÃO PAULO', 'PARANÁ', 'TOCANTINS', 'DISTRITO FEDERAL'];
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
    
    public static get TERRABRASILIS_BUSINESS_API_HOST(): string {
        let url="http://terrabrasilis.dpi.inpe.br/business/api/v1/";

        if(process.env.BUILD_TYPE && process.env.ENV == 'production') {
            // confirm the 13111 port in docker-stacks/api/business-api-homologation.yaml
            if(process.env.BUILD_TYPE == 'homologation') url = "http://terrabrasilis2.dpi.inpe.br:13111/api/v1/";
            
            // confirm the 2222 port in docker-stacks/demo/docker-compose.yaml
            if(process.env.BUILD_TYPE == 'compose') url = "http://localhost:2222/api/v1/";
        }
        return url;
    };
}
