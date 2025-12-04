const apiEnv = process.env.REACT_APP_API_ENV;
const api = {
  localApi: '',
  webApi: '',
  loginApi: '',
  cmsApi: '',
};
const preApi = {
  localApi: '',
  webApi: '',
  loginApi: '',
  cmsApi: '',
};
const activeApi = apiEnv === 'preview' ? preApi : api;

module.exports = activeApi;
