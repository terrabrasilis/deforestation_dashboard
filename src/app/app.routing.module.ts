import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/*
 * Dashboard modules import
 */
import { DeforestationOptionsComponent } from './dashboard/deforestation/deforestation-options/deforestation-options.component';


const routes: Routes = [
    { path: 'dashboard/deforestation/biomes/:biome/:type', component: DeforestationOptionsComponent },
    {
        path: "**",
        redirectTo: "dashboard/deforestation/biomes/legal_amazon/rates",
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