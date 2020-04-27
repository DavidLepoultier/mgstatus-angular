import { NgModule } from '@angular/core';
import { FilterPipe } from './pipes/filter.pipe';
import { UniqueProjectPipe } from './pipes/unique-project.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { PipesPipe } from './pipes/pipes.pipe';
import { DowntimePipe } from './pipes/downtime.pipe';
import { UniquePipe } from './pipes/unique.pipe';
import { ProxyNamePipe } from './pipes/proxy-name.pipe';
import { SnackBarComponent } from './snack-bar/snack-bar.component';

@NgModule({
  declarations: [
    FilterPipe,
    UniqueProjectPipe,
    DateFormatPipe,
    PipesPipe,
    DowntimePipe,
    UniquePipe,
    ProxyNamePipe,
    SnackBarComponent
  ],
  exports: [
    FilterPipe,
    UniqueProjectPipe,
    DateFormatPipe,
    PipesPipe,
    DowntimePipe,
    UniquePipe,
    ProxyNamePipe,
    SnackBarComponent
  ],
  imports: [],
  providers: [SnackBarComponent, FilterPipe, UniqueProjectPipe],
  bootstrap: [],
  schemas: []
})
export class SharingModule {}
