import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceValuesInString',
})
export class ReplaceValuesInStringPipe implements PipeTransform {
  transform(value: any, from: string[], to: string[]): any {
    if (!from) {
      return value;
    }

    let returnValue = value;
    for (var _i = 0; _i < from.length; _i++) {
        
        var regex = new RegExp(from[_i], 'g');
        returnValue = returnValue.replace(regex, to[_i]);
        
    }

    //var regex = new RegExp(from, 'g');
    //return value.replace(regex, to);
    return returnValue;
    
  }
}