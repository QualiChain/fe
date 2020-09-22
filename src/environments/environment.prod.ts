export const environment = {
  production: true,
  recomendationsUrl : 'http://qualichain.epu.ntua.gr:5000/recommendations',
  recomendationsUrlByCV : 'http://qualichain.epu.ntua.gr:7000/recommend',
  coursesUrl: 'http://qualichain.epu.ntua.gr:5004/courses',
  uploadFilesUrl : 'http://qualichain.epu.ntua.gr:5000/file-upload',
  badgesUrl : 'http://qualichain.epu.ntua.gr:5000/badges',
  authUrl : 'http://qualichain.epu.ntua.gr:5004/auth',
  usersUrl : 'http://qualichain.epu.ntua.gr:5004/users',
  userUrl : 'http://qualichain.epu.ntua.gr:5004/user',
  jobsUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  skillsUrl : 'http://qualichain.epu.ntua.gr:5004/skills',
  notificationsURL : 'http://qualichain.epu.ntua.gr:5004/notifications',
  cvUrl : 'http://knowledgebizvpn.ddns.net:8000/cv',//'http://qualichain.epu.ntua.gr:5000/CV',
  jobmatchingUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',//'http://localhost:8000/jobs',
  jobpostUrl : 'http://knowledgebizvpn.ddns.net:8000/jobs',
  validateCertificate : 'https://qualichain.herokuapp.com/qualichain/validateCertificate',
  JwtModule: {
    allowedDomains: ['localhost','qualichain.epu.ntua.gr', 'qualichain.herokuapp.com', 'fenix.tecnico.ulisboa.pt/oauth'],
    disallowedRoutes: ["http://example.com/examplebadroute/"]
  },
  CVRecomendationUrl: 'http://qualichain.epu.ntua.gr:8080/curriculum_recommendation',
  mcdssURL: 'http://qualichain.epu.ntua.gr:7070/mcdss',
  uploadUserAvatar: 'http://qualichain.epu.ntua.gr:5004/upload'
};
