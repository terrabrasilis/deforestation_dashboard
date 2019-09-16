import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WmsSearchComponent } from './wms/wms-search/wms-search.component';

/*
 * Dashboard modules import
 */
import { DeforestationOptionsComponent } from './dashboard/deforestation/deforestation-options/deforestation-options.component';


const routes: Routes = [
    { path: 'wms', component: WmsSearchComponent },    
    { path: 'dashboard/deforestation/biomes/:biome/:type', component: DeforestationOptionsComponent },
    {
        path: "**",
        redirectTo: "/map/deforestation",
        pathMatch: "full"
    }
];

@NgModule({
imports: [
    RouterModule.forRoot(routes)
],
exports: [
    RouterModule
],
declarations: []
})
export class AppRoutingModule { }