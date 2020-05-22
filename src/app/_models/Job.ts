// -job.ts
/*
export default class Product {
    JobName: string;
    JobDescription: string;
    JobPrice: number;
  }
*/

export class JobSkill {
    SkillLabel: string;  // required field
    proficiencyLevel: string;
    skillPriority: string;

/*
    assign: string;
    priority: string;
    */
  }  

  export class Job {
    id: string;
    label: string; // Position
    employmentType: string;
    level: string; // Seniority Level
    jobDescription: String;
    jobLocation: String;
    // SkillReq?: string [];
    skillReq: JobSkill [];
    startDate: string;
    endDate: string;
   /* id: number;
    creator_id: number;
    date: string;
    employment_type: string;
    end_date: string;
    job_description: string;
    level: string;
    skills?: [JobSkill];
    start_date: string;
    title: string;
    */
  }  