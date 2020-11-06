// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  localStorageSecretKey: 'QC_secret_key_to_be_replaced',
  recomendationsUrl : 'http://qualichain.epu.ntua.gr:5000/recommendations',
  recomendationsUrlByCV : 'http://qualichain.epu.ntua.gr:7000/recommend',
  coursesUrl: 'http://qualichain.epu.ntua.gr:5004/courses',
  uploadFilesUrl : 'http://qualichain.epu.ntua.gr:5004/user',
  downloadFilesUrl : 'http://qualichain.epu.ntua.gr:5004/download',
  deleteFilesUrl : 'http://qualichain.epu.ntua.gr:5004/delete',
  badgesUrl : 'http://qualichain.epu.ntua.gr:5000/badges',
  authUrl : 'http://qualichain.epu.ntua.gr:5004/auth',
  IAMAuthUrl : 'https://qualichain.herokuapp.com/users',
  usersUrl : 'http://qualichain.epu.ntua.gr:5004/users',
  userUrl : 'http://qualichain.epu.ntua.gr:5004/user',
  jobsUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  jobsProfilesUrl : 'http://knowledgebizvpn.ddns.net:8000/profiles',
  skillsUrl : 'http://qualichain.epu.ntua.gr:5004/skills',
  specializationsURL : 'http://qualichain.epu.ntua.gr:5004/skills',
  notificationsURL : 'http://qualichain.epu.ntua.gr:5004/notifications',
  cvUrl : 'http://knowledgebizvpn.ddns.net:8000/cv',//'http://qualichain.epu.ntua.gr:5000/CV',
  jobmatchingUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  jobpostUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  validateCertificate : 'https://qualichain.herokuapp.com/qualichain/validateCertificate',
  JwtModule: {
    allowedDomains: ['localhost','qualichain.epu.ntua.gr', 'qualichain.herokuapp.com', 'fenix.tecnico.ulisboa.pt/oauth'],
    disallowedRoutes: ["http://example.com/examplebadroute/"]
  },
  CVRecomendationUrl: 'http://qualichain.epu.ntua.gr:8080/curriculum_recommendation',
  mcdssURL: 'http://qualichain.epu.ntua.gr:7070/mcdss',
  uploadUserAvatar: 'http://qualichain.epu.ntua.gr:5004/upload',
  selectUrl: 'http://qualichain.epu.ntua.gr:5004/select',
  notificationPreferences: 'http://qualichain.epu.ntua.gr:5004/set',
  visualiserUrl: 'http://qualichain.epu.ntua.gr:8000/visualiser',
  uploadCVToKG: 'http://localhost:5000/KG'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
