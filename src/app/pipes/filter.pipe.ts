import { Pipe, PipeTransform } from '@angular/core';
import { MdbTableService } from 'angular-bootstrap-md';
import { isArray } from 'util';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  checkBoxArray:any = [];
  result:any;

  constructor(private mdbTable:MdbTableService) {}

  transform(items: any[], searchText: string, checkBox: any): any[] {
    if (!items) {
      return [];
    }
    if (!searchText && !checkBox) {
      return items;
    }
        
    this.mdbTable.setDataSource(items);
    this.result = [];
    this.result = this.mdbTable.getDataSource();
    if(checkBox && checkBox.checked) {
      let value = checkBox.source.value.toLocaleLowerCase();
      this.result = this.mdbTable.filterLocalDataBy(value) 
    }
    if(searchText) {
      searchText = searchText.toLocaleLowerCase();
      this.result = this.mdbTable.filterLocalDataBy(searchText);
    } 

    return this.result;
  }
}
