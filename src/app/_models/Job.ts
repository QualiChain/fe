// -job.ts
/*
export default class Product {
    JobName: string;
    JobDescription: string;
    JobPrice: number;
  }
*/

export class JobSkill {
    SkillLabel: string;
    assign: string;
    priority: string;
    proficiencyLevel: string;
  }  

  export class Job {
    id: number;
    creator_id: number;
    date: string;
    employment_type: string;
    end_date: string;
    job_description: string;
    level: string;
    skills?: [JobSkill];
    start_date: string;
    title: string;
  }  