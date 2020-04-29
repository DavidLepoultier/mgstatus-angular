import { NgModule } from '@angular/core';
import { FilterPipe } from './pipes/filter.pipe';
import { UniqueProjectPipe } from './pipes/unique-project.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { PipesPipe } from './pipes/pipes.pipe';
import { DowntimePipe } from './pipes/downtime.pipe';
import { UniquePipe } from './pipes/unique.pipe';
import { ProxyNamePipe } from './pipes/proxy-name.pipe';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { SortPipe } from './pipes/sort.pipe';
import { SortTemplateNamePipe } from './pipes/sort-template-name.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    UniqueProjectPipe,
    DateFormatPipe,
    PipesPipe,
    DowntimePipe,
    UniquePipe,
    SortPipe,
    SortTemplateNamePipe,
    ProxyNamePipe,
    SnackBarComponent
  ],
  exports: [
    FilterPipe,
    UniqueProjectPipe,
    DateFormatPipe,
    PipesPipe,
    DowntimePipe,
    SortPipe,
    SortTemplateNamePipe,
    UniquePipe,
    ProxyNamePipe,
    SnackBarComponent
  ],
  imports: [],
  providers: [SnackBarComponent, FilterPipe, UniquePipe, SortPipe, SortTemplateNamePipe],
  bootstrap: [],
  schemas: []
})
export class SharingModule {}
