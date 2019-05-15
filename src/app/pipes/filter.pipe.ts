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
    if(checkBox && checkBox.checked) {
      let resource = this.checkBoxArray.filter((j: any) => j === checkBox.source.value);
      if (resource.length === 0)
        this.checkBoxArray.push(checkBox.source.value);
    }

    if(checkBox && !checkBox.checked) {
      let index: number = this.checkBoxArray.indexOf(checkBox.source.value);
      if (index !== -1) {
        this.checkBoxArray.splice(index, 1);
      }
    }
        
    this.mdbTable.setDataSource(items);
    this.result = [];
    this.result = this.mdbTable.getDataSource();
    if(checkBox && this.checkBoxArray.length > 0) {
      this.result = [];
      for (let index = 0; index < this.checkBoxArray.length; index++) {
        const element = this.checkBoxArray[index];
        this.result = [
          ...this.result,
          ...this.mdbTable.filterLocalDataBy(element)
        ]
      }
      this.mdbTable.setDataSource(this.result);
    }

    if(searchText) {
      searchText = searchText.toLocaleLowerCase();
      this.result = this.mdbTable.filterLocalDataBy(searchText);
    } 

    return this.result;
  }
}
