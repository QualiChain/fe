// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//recomendationsUrl : 'http://qualichain.epu.ntua.gr:5000/recommendations',

export const environment = {
  production: false,
  localStorageSecretKey: 'QC_secret_key_to_be_replaced',  
  recomendationsUrlByCV : 'http://qualichain.epu.ntua.gr/ntuaAPI7000/recommend',
  coursesUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/courses',
  courseUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/course',
  uploadFilesUrl : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/user',
  downloadFilesUrl : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/download',
  deleteFilesUrl : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/delete',
  badgesUrl : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/badges',
  authUrl : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/auth',
  IAMtokenvalidation : true,
  IAMAuthUrl : 'https://qualichain.herokuapp.com/users',
  IAMValidateTokenUrl : 'https://qualichain.herokuapp.com/auth/validateToken',
  createUsreIAMUrl: 'https://qualichain.herokuapp.com/users/register',
  usersUrl : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/users',
  userUrl : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/user',
  //jobsUrl : '/proxyKBZ/jobs',
  jobsUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  //jobsProfilesUrl : '/proxyKBZ/profiles',
  jobsProfilesUrl : 'http://knowledgebizvpn.ddns.net:8000/profiles',
  skillsUrl : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/skills',
  specializationsURL : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/specializations',
  notificationsURL : 'http://qualichain.epu.ntua.gr/ntuaAPI5004/notifications',
  //cvUrl : '/proxyKBZ/cv',
  cvUrl : 'http://knowledgebizvpn.ddns.net:8000/cv',
  //skillsCV : '/proxyKBZ/skills',
  skillsCV : 'http://knowledgebizvpn.ddns.net:8000/skills',
  //jobmatchingUrl : '/proxyKBZ/jobs',
  jobmatchingUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  //jobpostUrl : '/proxyKBZ/jobs',
  jobpostUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  validateCertificate : 'https://qualichain.herokuapp.com/qualichain/validateCertificate',
  JwtModule: {
    allowedDomains: ['localhost','qualichain.epu.ntua.gr', 'qualichain.herokuapp.com', 'fenix.tecnico.ulisboa.pt/oauth'],
    disallowedRoutes: ["http://example.com/examplebadroute/"]
  },
  CVRecomendationUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI8080/curriculum_recommendation',
  mcdssURL: 'http://qualichain.epu.ntua.grntuaAPI7070/mcdss',
  uploadUserAvatar: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/upload',
  selectUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/select',
  notificationPreferences: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/set',  
  visualiserUrl: 'http://qualichain.epu.ntua.gr/ntuaViz',
  //uploadCVToKG: 'https://demo.iais.fraunhofer.de/dobie',
  uploadCVToKG: 'http://qualichain.epu.ntua.gr/dobie',
  //insertTextTriples: '/proxyKBZ/insertTextTriples',
  insertTextTriples: 'http://knowledgebizvpn.ddns.net/proxyKBZ/insertTextTriples',
  permissionsUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/user_permissions',
  avatarURL: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/get',
  thesisURL: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/thesis',
  thesisRequestURL: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/thesis_request',
  questionnaireURL: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/questionnaire',
  badging: 'https://blockchain21.kmi.open.ac.uk/badging',
  academicorganisationUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/academicorganisation',
  recruitmentorganisationUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/recruitmentorganisation',
  getLastJobIdUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/getlastjobid',
  getLastJobApplicationIdUrl: 'http://qualichain.epu.ntua.gr/ntuaAPI5004/getlastjobapplicationid'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.