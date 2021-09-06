import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHTMLTags',
})
export class RemoveHTLMTagsPipe implements PipeTransform {
  transform(value: string): any {
    
    return  value ? String(value).replace(/<[^>]+>/gm, '') : '';
    
  }
}