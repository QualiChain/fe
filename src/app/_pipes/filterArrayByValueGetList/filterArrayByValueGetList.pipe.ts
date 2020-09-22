import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "FilterArrayByValueGetList",
  pure: false
})
export class FilterArrayByValueGetListPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any {
    if (!items) [];
    if (!value || value.length == 0) [];
    return items.filter(
      it => String(it[field]) === value
    );
  }
}