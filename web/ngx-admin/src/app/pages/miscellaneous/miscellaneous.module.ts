import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbPopoverDirective,NbAlertModule,NbIconModule } from '@nebular/theme';
import { NbPopoverModule } from '@nebular/theme'; 
import { NbSpinnerModule,  NbProgressBarModule,} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProgressBarComponent } from '../extra-components/progress-bar/progress-bar.component';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    MiscellaneousRoutingModule,
    NbPopoverModule,
    NbSpinnerModule,
    NbAlertModule,
    NbIconModule,
    NbProgressBarModule,
  ],
  declarations: [
    MiscellaneousComponent,
    NotFoundComponent,
  ],
  exports: [NbPopoverDirective,NbSpinnerModule],
})
export class MiscellaneousModule { }
