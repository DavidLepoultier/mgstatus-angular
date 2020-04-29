import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortTemplateName'
})
export class SortTemplateNamePipe implements PipeTransform {

  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a.templateName < b.templateName) {
        return -1;
      } else if (a.templateName > b.templateName) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
