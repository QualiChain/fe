import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employmentType'
})
export class EmploymentTypePipe implements PipeTransform {
  /*
  transform(value: any, ...args: any[]): any {
    return null;
  }
  */
  transform(value: string): string {
    let returnString = "";
    switch(value) { 
      case "1": { 
         returnString ="JOB.EMPLOYMENT_TYPE.OPTIONS.FULL_TIME";
         break; 
      } 
      case "2": { 
         returnString ="JOB.EMPLOYMENT_TYPE.OPTIONS.PART_TIME";
         break; 
      }
      case "3": { 
          returnString ="JOB.EMPLOYMENT_TYPE.OPTIONS.CONTRACT";
          break; 
      } 
      case "4": { 
          returnString ="JOB.EMPLOYMENT_TYPE.OPTIONS.TEMPORARY";
          break; 
      }      
      case "5": { 
          returnString ="JOB.EMPLOYMENT_TYPE.OPTIONS.VOLUNTEER";
          break; 
      }         
      case "6": { 
          returnString ="JOB.EMPLOYMENT_TYPE.OPTIONS.INTERNSHIP";
          break; 
      }          
      default: { 
          returnString = value;
          break; 
      } 
   } 

    return returnString;
  }

}
