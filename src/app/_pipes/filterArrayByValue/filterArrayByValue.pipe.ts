import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "FilterArrayByValue",
  pure: false
})
export class FilterArrayByValuePipe implements PipeTransform {
  transform(items: any[], field: string, value: string): number {
    if (!items) return 0;
    if (!value || value.length == 0) return 0;
    return items.filter(
      it => String(it[field]) === value
    ).length;
  }
}