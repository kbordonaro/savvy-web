export default (path, absolute) => {
  let prefix = (__DEV__ || absolute)  ? 'https://savvycreationsdesign.com/' : '';

  return prefix + path;
};