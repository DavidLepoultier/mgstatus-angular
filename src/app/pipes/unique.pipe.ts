import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {

  transform(items: any[]): any {
    let allItems = items.map(data => data.env);
    let resource = allItems.filter((x, i, a) => x && a.indexOf(x) === i);
    return resource;
  }

}
