import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'levelType'
})
export class LevelTypePipe implements PipeTransform {
/*
  transform(value: any, ...args: any[]): any {
    return null;
  }
*/
  transform(value: string): string {
    let returnString = "";
    switch(value) { 
      case "1": { 
          returnString ="JOB.EMPLOYMENT_LEVEL.OPTIONS.INTERNERSHIP";
          break; 
      } 
      case "2": { 
          returnString ="JOB.EMPLOYMENT_LEVEL.OPTIONS.ENTITY_LEVEL";
          break; 
      }
      case "3": { 
          returnString ="JOB.EMPLOYMENT_LEVEL.OPTIONS.ASSOCIATE";
          break; 
      } 
      case "4": { 
          returnString ="JOB.EMPLOYMENT_LEVEL.OPTIONS.MID_SENIOR_LEVEL";
          break; 
      }      
      case "5": { 
          returnString ="JOB.EMPLOYMENT_LEVEL.OPTIONS.DIRECTOR";
          break; 
      }         
      case "6": { 
          returnString ="JOB.EMPLOYMENT_LEVEL.OPTIONS.EXECUTIVE";
          break; 
      }          
      case "7": { 
          returnString ="JOB.EMPLOYMENT_LEVEL.OPTIONS.NOT_APPLICABLE";
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
