## civicrm-cv-node

This is a wrapper for interacting with a local CiviCRM instance (in the
current folder).  You may call `cv` subcommands such as `api` or `url`

By default, results are returned as promises:

```javascript
var cv = require('civicrm-cv')({mode: 'promise'});
cv('api contact.get id=1').then(function(result){
  console.log("Found records: " + result.count);
});
```

Alternatively, you may execute subcommands synchronously:

```javascript
var cvSync = require('civicrm-cv')({mode: 'sync'});
var result = cvSync('api contact.get id=1');
console.log("Found records: " + result.count);
```

Note that the previous examples specify the full subcommand (i.e.  all
options are passed in one string).  If wish you to break them up, pass an
array.  Each array item will be automatically escaped.

This is particularly when uses the `php:eval` subcommand -- which often
involves passing unusual characters, e.g.

```javascript
var cvSync = require('civicrm-cv')({mode: 'sync'});
var result = cv(['php:eval', '$x = \'"\'; return [$x . 123 . $x];']);
console.log("Found records: " + result);
```