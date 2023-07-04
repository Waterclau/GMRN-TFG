/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  NbThemeModule,
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbButtonModule,
  NbCardModule, 
  NbCheckboxModule, 
} from '@nebular/theme';


@NgModule({
  declarations: [AppComponent],
  imports: [
    NbThemeModule.forRoot({
      name: 'dark', // Configura el tema predeterminado
    }),
    BrowserModule,
    BrowserAnimationsModule,
    NbButtonModule,
    HttpClientModule,
    AppRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),

  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
