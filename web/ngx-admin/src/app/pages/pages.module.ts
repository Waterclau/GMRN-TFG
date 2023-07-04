import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { NbMenuModule,NbCheckboxModule,NbCardModule  } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { NgxLoginComponent } from './auth/login/login.component';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { RegisterComponent } from './auth/register/register.component'
import { MainModule } from './main/main.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    FormsModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbCheckboxModule,
    NbCardModule,
    ReactiveFormsModule,
    MainModule,
  ],
  declarations: [
    PagesComponent,
    NgxLoginComponent,
    RegisterComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA 
  ],
  bootstrap: [NgxLoginComponent],
})
export class PagesModule {
}
