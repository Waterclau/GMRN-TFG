import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbPopoverDirective,NbAlertModule,NbIconModule } from '@nebular/theme';
import { NbPopoverModule } from '@nebular/theme'; 
import { NbSpinnerModule,  NbProgressBarModule,} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
//import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
//import { MiscellaneousComponent } from './miscellaneous.component';
//mport { NotFoundComponent } from './not-found/not-found.component';
import { ProgressBarComponent } from '../extra-components/progress-bar/progress-bar.component';
import { GeneratorComponent } from './generator/generator.component';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    MainRoutingModule,
    //MiscellaneousRoutingModule,
    NbPopoverModule,
    NbSpinnerModule,
    NbAlertModule,
    NbIconModule,
    NbProgressBarModule,
  ],
  declarations: [
    MainComponent,
    GeneratorComponent,
    //MiscellaneousComponent,
    //NotFoundComponent,
  ],
  exports: [NbPopoverDirective,NbSpinnerModule],
})
export class MainModule { }
