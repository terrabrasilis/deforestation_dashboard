/**
 * This class is responsible to store all global variables to use in entire application and not duplicate code
 */
export class Constants {

    public static get DASHBOARD_API_HOST(): string {
        let url="http://terrabrasilis.dpi.inpe.br/dashboard/api/v1/redis-cli/";

        if(process.env.BUILD_TYPE == 'development') url = "http://localhost:3000/dashboard/api/v1/redis-cli/";

        if(process.env.BUILD_TYPE && process.env.ENV == 'production') {
            // confirm the 13111 port in docker-stacks/api/business-api-homologation.yaml
            if(process.env.BUILD_TYPE == 'homologation') url = "http://terrabrasilis.dpi.inpe.br/homologation/dashboard/api/v1/redis-cli/";
            
            // confirm the 2222 port in docker-stacks/demo/docker-compose.yaml
            if(process.env.BUILD_TYPE == 'compose') url = "http://localhost:2222/api/v1/redis-cli/";
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
        let maitanableYears: number[] = [2000, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
        return maitanableYears;
    };

    /**
     * Used to change the color of the bar and the tooltip of the reference bar when data for a specific year is preliminary data.
     * To disable this behavior and change the notes about the released data, simply return null value.
     */
    public static get BARCHART_PRELIMINARY_DATA_YEAR(): String {
        // enable preliminary notes
        //return '2020';
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
