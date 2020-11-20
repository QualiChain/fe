import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'orderTemplatePipe'
})
export class OrderTemplatePipePipe implements PipeTransform {

  constructor(private translate : TranslateService) {}

  transform(array: Array<any>, field: string): Array<any>
  {
    array.sort((a: any, b: any) =>
    {
      if (this.translate.instant(a[field].toLowerCase()) < this.translate.instant(b[field].toLowerCase()))
        return -1;
      else if (this.translate.instant(a[field].toLowerCase()) > this.translate.instant(b[field].toLowerCase()))
        return 1;
      else
        return 0;
    });
    return array;
  }

}
