// -job.ts
/*
export default class Product {
    JobName: string;
    JobDescription: string;
    JobPrice: number;
  }
*/

export class JobSkill {
    label: string;
    assign: string;
    priorityLevel: string;
    proficiencyLevel: string;
  }  

  export class WorkHistory {
    position: string;
    duration: string;
    comment: string;
  }  

  export class Education {
    title: string;
    from: string;
    to: string;
    organisation: string;
    description: string;
  }  

  export class Job {
    id: string;
    creator_id?: string;
    label: string; // Position
    contractType: string;
    seniorityLevel: string; // Seniority Level
    jobDescription: String;
    jobLocation: String;
    // SkillReq?: string [];
    skillReq: JobSkill [];
    workExperienceReq: WorkHistory[];
    educationReq: Education[];
    startDate: string;
    endDate: string;
    hiringOrg?: string;
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