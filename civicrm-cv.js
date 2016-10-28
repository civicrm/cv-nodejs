var execPromise = require('child-process-promise').exec;
var execSync = require('child_process').execSync;

var escape = function(cmd) {
  return '\'' + cmd.replace(/'/g, "'\\''") + '\'';
};

function serializeArgs(args) {
  var argsStr = '';
  for (var i = 0; i < args.length; i++) {
    argsStr += ' ' + escape(args[i]);
  }
  return argsStr;
}

var jsonExecFuncs = {
  sync: function jsonExecSync(cmd, env) {
    var result = execSync(cmd, {env: env});
    return JSON.parse(result.toString());
  },
  promise: function jsonExecPromise(cmd, env) {
    return execPromise(cmd, {env: env}).then(function(result) {
      return JSON.parse(result.stdout);
    });
  }
};

module.exports = function(options) {
  if (!options || options.mode === undefined) {
    throw "civicrm-cv: Please specify \'mode\' option.";
  }
  if (!jsonExecFuncs[options.mode]) {
    throw "civicrm-cv: Invalid \'mode\' option";
  }

  return function(subcommand) {
    var cmd;
    if (typeof subcommand === 'string') {
      cmd = 'cv ' + subcommand;
    }
    else {
      cmd = 'cv' + serializeArgs(subcommand);
    }

    var env = {};
    for (var key in process.env) {
      env[key] = process.env[key];
    }
    env.CV_OUTPUT = 'json';

    return jsonExecFuncs[options.mode].apply(null, [cmd, env]);
  };
};
