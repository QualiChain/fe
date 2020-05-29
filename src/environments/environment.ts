// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  recomendationsUrl : 'http://qualichain.epu.ntua.gr:5000/recommendations',
  coursesUrl: 'http://qualichain.epu.ntua.gr:5000/courses',
  uploadFilesUrl : 'http://localhost:3000/upload',
  badgesUrl : 'http://qualichain.epu.ntua.gr:5000/badges',
  authUrl : 'http://qualichain.epu.ntua.gr:5000/auth',
  usersUrl : 'http://qualichain.epu.ntua.gr:5000/users',
  userUrl : 'http://qualichain.epu.ntua.gr:5000/user',
  jobsUrl : 'http://qualichain.epu.ntua.gr:5000/jobs',  
  skillsUrl : 'http://qualichain.epu.ntua.gr:5000/skills',
  notificationsURL : 'http://qualichain.epu.ntua.gr:5000/notifications',
  smartBadgesManagementUrl : 'https://localhost:4000/smartBadgesManagement',
  verificationAndEquivalenceUrl : 'https://localhost:4000/verificationAndEquivalence',
  profileUrl : 'https://localhost:4000/profile',
  educationManagementUrl : 'https://localhost:4000/educationManagement',
  competencyManagementUrl : 'https://localhost:4000/competencyManagement',
  cvUrl : 'http://qualichain.epu.ntua.gr:5000/CV',
  jobmatchingUrl : 'http://localhost:8000/jobmatching',
  jobpostGet : 'https://localhost:8000/jobget',  
  jobpostUrl : 'https://localhost:8000/jobpost'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
