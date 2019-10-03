/** 
 * Angular imports
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

/**
 * Custom module created imports
 */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialCoreModule } from './core-modules/material-core.module';
import { AppRoutingModule } from './app.routing.module';
import { LocalStorageModule } from '@ngx-pwa/local-storage';
import { SharedModule } from './core-modules/shared.module';
import { PipeSharedModule } from './core-modules/pipe-shared.module';

/**
 * Custom component imports
 */
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { ContactComponent } from './contact/contact.component';
import { TerrabrasilisApiComponent } from './tool/terrabrasilis-api/terrabrasilis-api.component';

/**
 * Services
 */
import { DownloadService } from './services/download.service';
import { LocalStorageService } from './services/local-storage.service';

/**
 * Providers
 */
import { localStorageProviders } from '@ngx-pwa/local-storage';

/**
 * Dashboard modules import
 */
// services
import { DashboardApiProviderService } from './services/dashboard-api-provider.service';
import { GraphProviderService } from './services/graph-provider.service';
import { DashboardLoiSearchService } from './services/dashboard-loi-search.service';

// deforestation
import { DeforestationOptionsComponent } from './dashboard/deforestation/deforestation-options/deforestation-options.component';
import { LoiSearchComponent } from './dashboard/loi-search/loi-search.component';

/**
 * Translate tool
 */
import { HttpLoaderFactory } from "./factory/httpLoaderFactory"; 

/**
 * Node modules import
 */
import * as Jsonix from 'terrabrasilis-jsonix';
import * as ogcSchemas from 'ogc-schemas';
import * as w3cSchemas from 'w3c-schemas';
import 'hammerjs';

import * as d3 from 'd3';
import * as $ from 'jquery';
import * as _ from 'lodash';
import 'gridstack';

import { OnDemandDownloadComponent } from './dashboard/on-demand-download/on-demand-download.component';
import * as gridstack from 'gridstack';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    DeforestationOptionsComponent,
    ContactComponent,
    LoiSearchComponent,
    OnDemandDownloadComponent,
    TerrabrasilisApiComponent
  ],
  imports: [
    PipeSharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialCoreModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    /**
     * Active the translate tool for entire app
     */
    TranslateModule.forRoot({
      loader: {
         provide: TranslateLoader,
         useFactory: HttpLoaderFactory,
         deps: [HttpClient]
      }
    }),
   /**
    * Enable local storage module
    */
   LocalStorageModule,
   CommonModule,
   SharedModule,
  ],
  providers: [
    DashboardApiProviderService,
    DownloadService,
    LocalStorageService,
    localStorageProviders({ prefix: 'TBV01_' }),
    GraphProviderService,
    DashboardLoiSearchService,
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    DialogComponent,
    ContactComponent, 
    TerrabrasilisApiComponent
  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]  
})
export class AppModule { }
