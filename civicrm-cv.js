var execPromise = require('child-process-promise').exec;
var execSync = require('child_process').execSync;

var escape = function(cmd) {
  return '\'' + cmd.replace(/'/g,"'\\''") + '\'';
};

/**
 * Execute a JSON subcommand. Return a promise.
 *
 * @param args Array List of shell parameters to pass through.
 * @returns Promise
 */
var jsonExecPromise = function jsonExecPromise(args) {
  var cmd = 'cv';
  for (var i = 0; i < args.length; i++) {
    cmd += ' ' + escape(args[i]);
  }

  var env = {};
  for (var key in process.env) {
    env[key] = process.env[key];
  }
  env.CV_OUTPUT = 'json';

  return execPromise(cmd, {env: env}).then(function(result){
    return JSON.parse(result.stdout);
  });
};

/**
 * Execute a JSON subcommand. Return the parsed result.
 *
 * @param args Array List of shell parameters to pass through.
 * @return {*}
 */
var jsonExecSync = function jsonExecSync(args) {
  var cmd = 'cv';
  for (var i = 0; i < args.length; i++) {
    cmd += ' ' + escape(args[i]);
  }

  var env = {};
  for (var key in process.env) {
    env[key] = process.env[key];
  }
  env.CV_OUTPUT = 'json';

  var result = execSync(cmd, {env: env});
  return JSON.parse(result.toString());
};

var encodeApiParams = function encodeApiParams(entity, action, params) {
  var result = ['api'];
  result.push(entity + '.' + action);

  for (var key in params) {
    if (typeof params[key] == 'object') {
      // FIXME: To get full support, pass API params as JSON via STDIN.
      throw 'node-civicrm-cv does not currently supported nested API parameters';
    }
    result.push(key + '=' + params[key]);
  }

  return result;
};

module.exports = function(options) {
  if (!options) options = {};
  if (!options.mode) options.mode = 'promise';

  var jsonExecFuncs = {
    sync: jsonExecSync,
    promise: jsonExecPromise
  };
  var execFunc = jsonExecFuncs[options.mode];

  return {
    url: function(path) { return execFunc(['url', path]); },
    varsShow: function() { return execFunc(['vars:show']); },
    phpEval: function(code) { return execFunc(['php:eval', code]); },
    phpScript: function(file) { return execFunc(['php:script', file]); },
    api: function(entity, action, params) {
      return execFunc(encodeApiParams(entity, action, params));
    }
  }
};
