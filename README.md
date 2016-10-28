## node-civicrm-cv

This is a wrapper for interacting with a local CiviCRM instance (in the
current folder).  You may call `cv` subcommands such as `api` or `url`

By default, results are returned as promises:

```javascript
var cv = require('civicrm-cv')();
cv.api('Contact', 'get', {id: 1}).then(function(result){
  console.log("Found records: " + result.count);
});
```

Alternatively, you may execute subcommands synchronously:

```javascript
var cvSync = require('civicrm-cv')({mode: 'sync'});
var result = cvSync.api('Contact', 'get', {id: 1});
console.log("Found records: " + result.count);
```

Note: If a `cv` subcommand includes a colon, then we present it in
Javascript using camel-case, e.g.  `cv php:eval` becomes `cv.phpEval()`.
