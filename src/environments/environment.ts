// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  recomendationsUrl : 'http://qualichain.epu.ntua.gr:5000/recommendations',
  recomendationsUrlByCV : 'http://qualichain.epu.ntua.gr:7000/recommend',
  coursesUrl: 'http://qualichain.epu.ntua.gr:5000/courses',
  uploadFilesUrl : 'http://qualichain.epu.ntua.gr:5000/file-upload',
  badgesUrl : 'http://qualichain.epu.ntua.gr:5000/badges',
  authUrl : 'http://qualichain.epu.ntua.gr:5000/auth',
  usersUrl : 'http://qualichain.epu.ntua.gr:5000/users',//'http://localhost:8000/profiles',
  userUrl : 'http://qualichain.epu.ntua.gr:5000/user',
  jobsUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',//'http://qualichain.epu.ntua.gr:5000/jobs',  
  //jobsUrl : 'proxyKBZ/jobs',
  skillsUrl : 'http://qualichain.epu.ntua.gr:5000/skills',
  notificationsURL : 'http://qualichain.epu.ntua.gr:5000/notifications',
  smartBadgesManagementUrl : 'https://localhost:4000/smartBadgesManagement',
  verificationAndEquivalenceUrl : 'https://localhost:4000/verificationAndEquivalence',
  profileUrl : 'https://localhost:4000/profile',
  educationManagementUrl : 'https://localhost:4000/educationManagement',
  competencyManagementUrl : 'https://localhost:4000/competencyManagement',  
  cvUrl : 'http://knowledgebizvpn.ddns.net:8000/cv',//'http://qualichain.epu.ntua.gr:5000/CV',
  //cvUrl : 'proxyKBZ/cv',
  jobmatchingUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',//'http://localhost:8000/jobs',
  //jobmatchingUrl : 'proxyKBZ/jobs',
  jobpostGet : 'https://localhost:8000/jobget',  
  jobpostUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  //validateCertificate : 'recruitmentComponent/validateCertificate',
  validateCertificate : 'https://qualichain.herokuapp.com/qualichain/validateCertificate',
  JwtModule: {
    allowedDomains: ['localhost','qualichain.epu.ntua.gr', 'qualichain.herokuapp.com', 'fenix.tecnico.ulisboa.pt/oauth'],
    disallowedRoutes: ["http://example.com/examplebadroute/"]
  },
  CVRecomendationUrl: 'http://qualichain.epu.ntua.gr:8080/curriculum_recommendation'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
