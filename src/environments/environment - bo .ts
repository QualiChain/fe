// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//recomendationsUrl : 'http://qualichain.epu.ntua.gr:5000/recommendations',

export const environment = {
  production: false,
  localStorageSecretKey: 'QC_secret_key_to_be_replaced',  
  recomendationsUrlByCV : '/ntuaAPI5004/recommend',
  coursesUrl: '/ntuaAPI5004/courses',
  courseUrl: '/ntuaAPI5004/course',
  uploadFilesUrl : '/ntuaAPI5004/user',
  downloadFilesUrl : '/ntuaAPI5004/download',
  deleteFilesUrl : '/ntuaAPI5004/delete',
  badgesUrl : '/ntuaAPI5004/badges',
  authUrl : '/ntuaAPI5004/auth',
  IAMtokenvalidation : true,
  IAMAuthUrl : 'https://qualichain.herokuapp.com/users',
  IAMValidateTokenUrl : 'https://qualichain.herokuapp.com/auth/validateToken',
  createUsreIAMUrl: 'https://qualichain.herokuapp.com/users/register',
  usersUrl : '/ntuaAPI5004/users',
  userUrl : '/ntuaAPI5004/user',
  //jobsUrl : '/proxyKBZ/jobs',
  jobsUrl : 'http://vpnknowledgebiz.ddns.net/proxyKBZ/jobs',
  //jobsProfilesUrl : '/proxyKBZ/profiles',
  jobsProfilesUrl : 'http://vpnknowledgebiz.ddns.net/proxyKBZ/profiles',
  skillsUrl : '/ntuaAPI5004/skills',
  specializationsURL : '/ntuaAPI5004/specializations',
  notificationsURL : '/ntuaAPI5004/notifications',
  //cvUrl : '/proxyKBZ/cv',
  cvUrl : 'http://vpnknowledgebiz.ddns.net/proxyKBZ/cv',
  //skillsCV : '/proxyKBZ/skills',
  skillsCV : 'http://vpnknowledgebiz.ddns.net/proxyKBZ/skills',
  skillCV : 'http://vpnknowledgebiz.ddns.net/proxyKBZ/skill',
  //jobmatchingUrl : '/proxyKBZ/jobs',
  jobmatchingUrl : 'http://vpnknowledgebiz.ddns.net/proxyKBZ/jobs',
  //jobpostUrl : '/proxyKBZ/jobs',
  jobpostUrl : 'http://vpnknowledgebiz.ddns.net/proxyKBZ/jobs',
  validateCertificate : 'https://qualichain.herokuapp.com/qualichain/validateCertificate',
  JwtModule: {
    allowedDomains: ['localhost','qualichain.epu.ntua.gr', 'qualichain.herokuapp.com', 'fenix.tecnico.ulisboa.pt/oauth'],
    disallowedRoutes: ["http://example.com/examplebadroute/"]
  },
  CVRecomendationUrl: '/ntuaAPI8080/curriculum_recommendation',
  mcdssURL: '/ntuaAPI7070/mcdss',
  uploadUserAvatar: '/ntuaAPI5004/upload',
  selectUrl: '/ntuaAPI5004/select',
  notificationPreferences: '/ntuaAPI5004/set',  
  visualiserUrl: '/ntuaViz',
  //uploadCVToKG: 'https://demo.iais.fraunhofer.de/dobie',
  uploadCVToKG: '/dobie',
  //insertTextTriples: '/proxyKBZ/insertTextTriples',
  insertTextTriples: 'http://vpnknowledgebiz.ddns.net/proxyKBZ/insertTextTriples',
  permissionsUrl: '/ntuaAPI5004/user_permissions',
  avatarURL: '/ntuaAPI5004/get',
  thesisURL: '/ntuaAPI5004/thesis',
  thesisRequestURL: '/ntuaAPI5004/thesis_request',
  questionnaireURL: '/ntuaAPI5004/questionnaire',
  badging: 'https://blockchain21.kmi.open.ac.uk/badging',
  academicorganisationUrl: '/ntuaAPI5004/academicorganisation',
  recruitmentorganisationUrl: '/ntuaAPI5004/recruitmentorganisation',
  getLastJobIdUrl: '/ntuaAPI5004/getlastjobid',
  getLastJobApplicationIdUrl: '/ntuaAPI5004/getlastjobapplicationid'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
