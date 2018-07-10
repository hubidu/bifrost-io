const gitconfig = require('git-config-path');
const parse = require('parse-git-config');

module.exports = function(options) {
  try {
    const gc = gitconfig(Object.assign({type: 'global'}, options && options.gitconfig));
    options = Object.assign({cwd: '/', path: gc}, options);
    const config = parse.sync(options) || {};
    return config.user ? config.user : null;  
  } catch (err) {
      console.log('WARNING Could not determine git user info', err)
  }
};