/** 
 * Angular imports
 */
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

/**
 * Custom module created imports
 */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageModule } from '@ngx-pwa/local-storage';
import { AppRoutingModule } from './app.routing.module';
import { MaterialCoreModule } from './core-modules/material-core.module';
import { PipeSharedModule } from './core-modules/pipe-shared.module';

/**
 * Custom component imports
 */
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { DialogComponent } from './dialog/dialog.component';

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
import { DashboardLoiSearchService } from './services/dashboard-loi-search.service';
import { GraphProviderService } from './services/graph-provider.service';

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
import 'hammerjs';

import 'gridstack';

import { OnDemandDownloadComponent } from './dashboard/on-demand-download/on-demand-download.component';
import { MarcoUeInfoComponent } from './dashboard/marco-ue-info/marco-ue-info.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    DeforestationOptionsComponent,
    ContactComponent,
    LoiSearchComponent,
    OnDemandDownloadComponent,
    MarcoUeInfoComponent
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
  ],
  providers: [
    DashboardApiProviderService,
    DownloadService,
    LocalStorageService,
    localStorageProviders({ prefix: 'TBV01_' }),
    GraphProviderService,
    DashboardLoiSearchService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    DialogComponent,
    ContactComponent,
  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]  
})
export class AppModule { }
