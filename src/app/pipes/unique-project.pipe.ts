import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniqueProject'
})
export class UniqueProjectPipe implements PipeTransform {

  transform(items: any[]): any {
    let allItems = items.map(data => data);
    let resource = allItems.filter((x, i, a) => x && a.indexOf(x) === i);
    return resource;
  }


}
