// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//recomendationsUrl : 'http://qualichain.epu.ntua.gr:5000/recommendations',

export const environment = {
  production: false,
  localStorageSecretKey: 'QC_secret_key_to_be_replaced',  
  recomendationsUrlByCV : 'http://qualichain.epu.ntua.gr:7000/recommend',
  coursesUrl: 'http://qualichain.epu.ntua.gr:5004/courses',
  courseUrl: 'http://qualichain.epu.ntua.gr:5004/course',
  uploadFilesUrl : 'http://qualichain.epu.ntua.gr:5004/user',
  downloadFilesUrl : 'http://qualichain.epu.ntua.gr:5004/download',
  deleteFilesUrl : 'http://qualichain.epu.ntua.gr:5004/delete',
  badgesUrl : 'http://qualichain.epu.ntua.gr:5004/badges',
  badgesV2Url : 'http://qualichain.epu.ntua.gr:5004',
  authUrl : 'http://qualichain.epu.ntua.gr:5004/auth',
  IAMtokenvalidation : true,
  IAMAuthUrl : 'https://qualichain.herokuapp.com/users',
  IAMValidateTokenUrl : 'https://qualichain.herokuapp.com/auth/validateToken',
  createUsreIAMUrl: 'https://qualichain.herokuapp.com/users/register',
  usersUrl : 'http://qualichain.epu.ntua.gr:5004/users',
  userUrl : 'http://qualichain.epu.ntua.gr:5004/user',
  jobsUrl : 'http://vpnknowledgebiz.ddns.net:8000/jobs',
  jobsProfilesUrl : 'http://vpnknowledgebiz.ddns.net:8000/profiles',
  skillsUrl : 'http://qualichain.epu.ntua.gr:5004/skills',
  skillCV : 'http://vpnknowledgebiz.ddns.net/proxyKBZ/skill',
  specializationsURL : 'http://qualichain.epu.ntua.gr:5004/specializations',
  notificationsURL : 'http://qualichain.epu.ntua.gr:5004/notifications',
  cvUrl : 'http://vpnknowledgebiz.ddns.net:8000/cv',//'http://qualichain.epu.ntua.gr:5000/CV',
  skillsCV : 'http://vpnknowledgebiz.ddns.net:8000/skills',
  jobmatchingUrl : 'http://vpnknowledgebiz.ddns.net:8000/jobs',
  jobpostUrl : 'http://vpnknowledgebiz.ddns.net:8000/jobs',
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
  //uploadCVToKG: 'https://demo.iais.fraunhofer.de/dobie',
  uploadCVToKG: '/dobie',
  insertTextTriples: 'http://vpnknowledgebiz.ddns.net:8000/insertTextTriples',
  permissionsUrl: 'http://qualichain.epu.ntua.gr:5004/user_permissions',
  avatarURL: 'http://qualichain.epu.ntua.gr:5004/get',
  thesisURL: 'http://qualichain.epu.ntua.gr:5004/thesis',
  thesisRequestURL: 'http://qualichain.epu.ntua.gr:5004/thesis_request',
  questionnaireURL: 'http://qualichain.epu.ntua.gr:5004/questionnaire',
  badging: 'https://blockchain21.kmi.open.ac.uk/badging',
  academicorganisationUrl: 'http://qualichain.epu.ntua.gr:5004/academicorganisation',
  recruitmentorganisationUrl: 'http://qualichain.epu.ntua.gr:5004/recruitmentorganisation',
  getLastJobIdUrl: 'http://qualichain.epu.ntua.gr:5004/getlastjobid',
  getLastJobApplicationIdUrl: 'http://qualichain.epu.ntua.gr:5004/getlastjobapplicationid',
  degreComparison: '/degree-comparison/compare/similarity'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
